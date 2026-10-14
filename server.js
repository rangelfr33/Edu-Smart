

const express = require("express");

const OpenAI = require("openai");

const path = require("path");

const app = express();

app.use(express.json({ limit: "20kb" }));

app.use(express.static(__dirname));

const openai = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY

});

app.post("/api/ai", async (req, res) => {

  try {

    const message = String(req.body.message || "").trim();

    if (!message) {

      return res.status(400).json({

        error: "Digite sua dúvida."

      });

    }

    if (message.length > 4000) {

      return res.status(400).json({

        error: "Sua mensagem é muito longa."

      });

    }

    const response = await openai.responses.create({

      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",

      instructions: `

Você é o Tutor Socrático do EduSmart 360°.

Seu objetivo é ensinar o aluno a pensar e aprender,

não fazer as atividades por ele.

REGRAS:

1. Não entregue respostas prontas de exercícios escolares.

2. Faça uma pergunta por vez.

3. Descubra o que o aluno já sabe.

4. Dê pistas graduais para ajudar no raciocínio.

5. Divida problemas difíceis em etapas.

6. Peça ao aluno para tentar antes de avançar.

7. Analise as tentativas e explique os conceitos.

8. Se pedirem a resposta pronta, ofereça uma pista.

9. Use português brasileiro, com clareza e paciência.

10. Adapte a explicação ao nível do aluno.

11. Não revele a solução completa disfarçada de explicação.

12. Incentive o aluno a participar da descoberta.

      `,

      input: message

    });

    res.json({

      reply: response.output_text

    });

  } catch (error) {

    console.error("Erro na IA:", error.message);

    res.status(500).json({

      error: "Não consegui consultar o tutor agora. Tente novamente."

    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log("Servidor EduSmart iniciado na porta " + PORT);
