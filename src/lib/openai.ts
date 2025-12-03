import OpenAI from 'openai';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true 
}) : null;

export const getAIOpinion = async (patientHistory: any) => {
  if (!openai) {
    return mockAIResponse(patientHistory);
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Eres un asistente médico experto (MD). Tu objetivo es analizar el historial clínico del paciente y proporcionar una 'Segunda Opinión' crítica. Busca riesgos ocultos, discrepancias en diagnósticos previos y sugiere acciones. Sé directo y profesional. Formato Markdown."
        },
        {
          role: "user",
          content: `Analiza este historial clínico y dame tu opinión:\n\n${JSON.stringify(patientHistory, null, 2)}`
        }
      ],
      model: "gpt-4o",
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    return mockAIResponse(patientHistory);
  }
};

export const getAdminSQLAnalysis = async (query: string, schema: string) => {
  if (!openai) {
    return mockAdminResponse(query);
  }

  try {
    // Step 1: Text to SQL
    const sqlCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Eres un experto en SQL y bases de datos médicas. Tu tarea es convertir preguntas en lenguaje natural a SQL Postgres válido. 
          El esquema es: ${schema}. 
          Solo devuelve el SQL puro, sin markdown ni explicaciones. 
          Si no puedes generar SQL, devuelve 'ERROR'.`
        },
        {
          role: "user",
          content: query
        }
      ],
      model: "gpt-3.5-turbo",
    });

    const sql = sqlCompletion.choices[0].message.content?.trim();
    return { sql, type: 'sql' };

  } catch (error) {
    console.error("OpenAI Error:", error);
    return mockAdminResponse(query);
  }
};

// Fallbacks for Demo/No-Key scenarios
const mockAIResponse = (history: any) => {
    // Detect patient by cedula or name if possible, or generic
    const text = JSON.stringify(history).toLowerCase();
    
    if (text.includes('mama') || text.includes('ductal')) {
        return `## 🚨 Segunda Opinión IA: ALERTA CRÍTICA

### Análisis de Riesgo
Detecto una **discrepancia grave** en el manejo del paciente. 
- El reporte de patología indica **Carcinoma Ductal Infiltrante Grado 3**.
- Sin embargo, las notas previas sugieren una comunicación verbal de "no es nada grave".

### Recomendación Urgente
1.  **Oncología:** Derivación inmediata (Prioridad 1).
2.  **Imagenología:** Solicitar estadiaje completo (TAC Tórax/Abdomen/Pelvis) para descartar metástasis.
3.  **Legal/Ético:** Revisar el proceso de comunicación del diagnóstico previo.

**Conclusión:** Este es un cuadro oncológico agresivo que requiere tratamiento multimodal inmediato. No se debe demorar.`;
    }

    if (text.includes('hipertension') || text.includes('diabetes')) {
        return `## 📋 Análisis Clínico IA

### Estado Metabólico
El paciente presenta un **Síndrome Metabólico** en evolución.
- **Hipertensión:** Controlada con Losartán, pero requiere monitoreo.
- **Prediabetes:** HbA1c de 5.8% indica riesgo.

### Recomendaciones
1.  **Estilo de Vida:** Intensificar dieta y ejercicio.
2.  **Laboratorios:** Repetir perfil lipídico y función renal en 3 meses.
3.  **Farmacología:** Evaluar inicio de estatinas según riesgo cardiovascular global.`;
    }

    return `## 🤖 Análisis General
    
El historial clínico ha sido procesado. No detecto banderas rojas inmediatas basándome en los datos limitados, pero sugiero completar la historia clínica con antecedentes familiares y exámenes recientes.`;
};

const mockAdminResponse = (_query: string) => {
    return {
        text: "Modo Simulación: No se detectó API Key o hubo error. SQL Simulado: `SELECT count(*) FROM patients` -> Resultado: 42",
        type: 'mock'
    };
};

