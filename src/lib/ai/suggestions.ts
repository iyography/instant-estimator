import type {
  Industry,
  Language,
  AISuggestedQuestion,
  AISuggestionRequest,
} from '@/types/database';

const INDUSTRY_CONTEXT: Record<Industry, { en: string; sv: string }> = {
  electrician: {
    en: 'electrical services including installations, repairs, and upgrades',
    sv: 'eltjänster inklusive installationer, reparationer och uppgraderingar',
  },
  plumber: {
    en: 'plumbing services including repairs, installations, and maintenance',
    sv: 'rörmokartjänster inklusive reparationer, installationer och underhåll',
  },
  hvac: {
    en: 'heating, ventilation, and air conditioning services',
    sv: 'värme, ventilation och luftkonditioneringstjänster (VVS)',
  },
  general_contractor: {
    en: 'general construction and renovation services',
    sv: 'allmänna bygg- och renoveringstjänster',
  },
  painter: {
    en: 'painting and decorating services for interior and exterior',
    sv: 'måleri- och dekorationstjänster för interiör och exteriör',
  },
  landscaper: {
    en: 'landscaping, garden design, and outdoor maintenance',
    sv: 'landskapsarkitektur, trädgårdsdesign och utomhusunderhåll',
  },
  roofing: {
    en: 'roofing installation, repair, and maintenance',
    sv: 'takläggning, reparation och underhåll',
  },
  cleaning: {
    en: 'professional cleaning services for residential and commercial',
    sv: 'professionella städtjänster för bostäder och företag',
  },
  other: {
    en: 'professional services',
    sv: 'professionella tjänster',
  },
};

export function buildSuggestionPrompt(request: AISuggestionRequest): string {
  const industryContext = INDUSTRY_CONTEXT[request.industry][request.language];
  const languageInstruction = request.language === 'sv'
    ? 'All questions and answers MUST be in Swedish (Svenska).'
    : 'All questions and answers must be in English.';

  const existingQuestionsNote = request.existing_questions?.length
    ? `\n\nThe following questions already exist for this job type, so suggest DIFFERENT questions:\n${request.existing_questions.map(q => `- ${q}`).join('\n')}`
    : '';

  return `You are helping a contractor in the ${industryContext} industry create an instant estimator form for the job type: "${request.job_type_name}".

${languageInstruction}

Generate 3-5 relevant questions that would help estimate the price for this type of job. Each question should have 2-4 answer options that can affect the price.

For each answer option, suggest an appropriate price modifier:
- fixed_add: Add a fixed amount (use for adding features/complexity)
- fixed_subtract: Subtract a fixed amount (use for simpler options)
- percentage_add: Add a percentage of the base price
- percentage_subtract: Subtract a percentage of the base price
- multiply: Multiply the price (use for quantity-based questions)

The modifier_value should be:
- For fixed amounts: the amount in the local currency (without decimals)
- For percentages: the percentage (e.g., 10 for 10%)
- For multiply: the multiplier (e.g., 1.5 for 50% more)

Consider factors like:
- Scope/size of the job
- Complexity or difficulty
- Materials needed
- Location accessibility
- Urgency/timing
- Current conditions/age of existing systems${existingQuestionsNote}

Respond with a JSON object in this exact format:
{
  "questions": [
    {
      "question_text": "Question in ${request.language === 'sv' ? 'Swedish' : 'English'}",
      "question_type": "single_choice",
      "answer_options": [
        {
          "answer_text": "Answer option in ${request.language === 'sv' ? 'Swedish' : 'English'}",
          "price_modifier_type": "fixed_add",
          "price_modifier_value": 0
        }
      ]
    }
  ]
}`;
}

export async function generateSuggestions(
  request: AISuggestionRequest
): Promise<AISuggestedQuestion[]> {
  const prompt = buildSuggestionPrompt(request);

  // Try Anthropic first, then OpenAI
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (anthropicKey) {
    return generateWithAnthropic(prompt, anthropicKey);
  } else if (openaiKey) {
    return generateWithOpenAI(prompt, openaiKey);
  } else {
    throw new Error('No AI API key configured. Set ANTHROPIC_API_KEY or OPENAI_API_KEY.');
  }
}

async function generateWithAnthropic(
  prompt: string,
  apiKey: string
): Promise<AISuggestedQuestion[]> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Anthropic API error: ${error}`);
  }

  const data = await response.json();
  const content = data.content[0].text;

  return parseAIResponse(content);
}

async function generateWithOpenAI(
  prompt: string,
  apiKey: string
): Promise<AISuggestedQuestion[]> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that generates pricing estimation questions for contractors. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  return parseAIResponse(content);
}

function parseAIResponse(content: string): AISuggestedQuestion[] {
  try {
    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonStr.trim());

    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format: missing questions array');
    }

    // Validate and sanitize the response
    return parsed.questions.map((q: Record<string, unknown>) => ({
      question_text: String(q.question_text || ''),
      question_type: validateQuestionType(q.question_type as string) || 'single_choice',
      answer_options: Array.isArray(q.answer_options)
        ? q.answer_options.map((a: Record<string, unknown>) => ({
            answer_text: String(a.answer_text || ''),
            price_modifier_type: validateModifierType(a.price_modifier_type as string) || 'fixed_add',
            price_modifier_value: Number(a.price_modifier_value) || 0,
          }))
        : [],
    }));
  } catch (error) {
    console.error('Failed to parse AI response:', error, content);
    throw new Error('Failed to parse AI suggestions. Please try again.');
  }
}

function validateQuestionType(type: string): string | null {
  const validTypes = ['single_choice', 'multiple_choice', 'number_input', 'text_input'];
  return validTypes.includes(type) ? type : null;
}

function validateModifierType(type: string): string | null {
  const validTypes = ['fixed_add', 'fixed_subtract', 'percentage_add', 'percentage_subtract', 'multiply'];
  return validTypes.includes(type) ? type : null;
}

// Suggested job types by industry
export const SUGGESTED_JOB_TYPES: Record<Industry, { en: string[]; sv: string[] }> = {
  electrician: {
    en: [
      'EV Charger Installation',
      'Electrical Panel Upgrade',
      'Lighting Installation',
      'Outlet Installation/Repair',
      'Ceiling Fan Installation',
      'Smart Home Wiring',
      'Electrical Inspection',
    ],
    sv: [
      'Elbilsladdare Installation',
      'Uppgradering av Elcentral',
      'Belysningsinstallation',
      'Eluttag Installation/Reparation',
      'Takfläkt Installation',
      'Smart Hem Kabeldragning',
      'Elbesiktning',
    ],
  },
  plumber: {
    en: [
      'Leak Repair',
      'Drain Cleaning',
      'Water Heater Installation',
      'Toilet Installation',
      'Faucet Replacement',
      'Pipe Repair',
      'Bathroom Renovation Plumbing',
    ],
    sv: [
      'Läckagereparation',
      'Avloppsrensning',
      'Varmvattenberedare Installation',
      'Toalettinstallation',
      'Kranbyte',
      'Rörreparation',
      'Badrumsrenovering VVS',
    ],
  },
  hvac: {
    en: [
      'AC Installation',
      'Furnace Repair',
      'Heat Pump Installation',
      'Duct Cleaning',
      'Thermostat Installation',
      'HVAC Maintenance',
      'Ventilation System',
    ],
    sv: [
      'AC Installation',
      'Pannereparation',
      'Värmepump Installation',
      'Ventilationsrengöring',
      'Termostatinstallation',
      'VVS Underhåll',
      'Ventilationssystem',
    ],
  },
  general_contractor: {
    en: [
      'Kitchen Renovation',
      'Bathroom Renovation',
      'Basement Finishing',
      'Room Addition',
      'Deck Building',
      'Home Extension',
      'Interior Remodeling',
    ],
    sv: [
      'Köksrenovering',
      'Badrumsrenovering',
      'Källarrenovering',
      'Rumsutbyggnad',
      'Altan/Terrass Bygge',
      'Hemutbyggnad',
      'Inomhusrenovering',
    ],
  },
  painter: {
    en: [
      'Interior Painting',
      'Exterior Painting',
      'Cabinet Painting',
      'Wallpaper Installation',
      'Deck Staining',
      'Trim Painting',
      'Texture Application',
    ],
    sv: [
      'Inomhusmålning',
      'Utomhusmålning',
      'Skåpmålning',
      'Tapetsering',
      'Trallbetsning',
      'Listmålning',
      'Texturapplikation',
    ],
  },
  landscaper: {
    en: [
      'Lawn Maintenance',
      'Garden Design',
      'Tree Trimming',
      'Irrigation System',
      'Patio Installation',
      'Hedge Trimming',
      'Seasonal Cleanup',
    ],
    sv: [
      'Gräsmatteunderhåll',
      'Trädgårdsdesign',
      'Trädbeskärning',
      'Bevattningssystem',
      'Uteplats Installation',
      'Häckklippning',
      'Säsongsstädning',
    ],
  },
  roofing: {
    en: [
      'Roof Replacement',
      'Roof Repair',
      'Gutter Installation',
      'Roof Inspection',
      'Shingle Replacement',
      'Flat Roof Repair',
      'Chimney Repair',
    ],
    sv: [
      'Takbyte',
      'Takreparation',
      'Takränna Installation',
      'Takinspektion',
      'Takpannebyte',
      'Plattakreparation',
      'Skorstenreparation',
    ],
  },
  cleaning: {
    en: [
      'Deep House Cleaning',
      'Move-in/Move-out Cleaning',
      'Office Cleaning',
      'Window Cleaning',
      'Carpet Cleaning',
      'Post-Construction Cleaning',
      'Regular Maintenance Cleaning',
    ],
    sv: [
      'Storstädning',
      'Flyttstädning',
      'Kontorsstädning',
      'Fönsterputsning',
      'Mattvätt',
      'Byggstädning',
      'Regelbunden Hemstädning',
    ],
  },
  other: {
    en: ['Custom Service'],
    sv: ['Anpassad Tjänst'],
  },
};
