

const express = require("express");

const OpenAI = require("openai");

const app = express();

app.use(express.json({ limit: "20kb" }));

app.use(express.static(__dirname));

const openai = new OpenAI({

  apiKey: process.env.OPENAI_API_KEY

});

app.get("/api/health", (req, res) => {

  res.json({ status: "ok", service: "EduSmart 360" });

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

        error: "A mensagem é muito longa."

      });

    }

    const response = await openai.responses.create({

      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",

      instructions: `

Você é o Tutor Socrático do EduSmart 360°.

Seu objetivo é ensinar o aluno a pensar, sem fazer

as atividades escolares por ele.

- Faça uma pergunta por vez.

- Descubra o que o aluno já sabe.

- Dê pistas graduais.

- Divida problemas em etapas menores.

- Peça que o aluno tente resolver.

- Analise as tentativas e explique os conceitos.

- Se pedirem a resposta pronta, ofereça uma pista.

- Use português brasileiro, com clareza e paciência.

- Não revele a solução completa disfarçada de explicação.

- Incentive a participação ativa do aluno.

      `,

      input: message

    });

    res.json({ reply: response.output_text });

  } catch (error) {

    console.error("Erro na IA:", error.message);

    res.status(500).json({

      error: "Não consegui consultar a IA agora. Tente novamente."

    });

  }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {

  console.log("EduSmart 360 iniciado na porta " + PORT);

});
