const SUPABASE_URL = "https://qsvlkwavpfcnkkkfqorq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdmxrd2F2cGZjbmtra2Zxb3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjM0MDAsImV4cCI6MjA3MTc5OTQwMH0.AA_aWmq-10vaa1cKoDTXThsJobZ9F-Ln7g4c0WysNtE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const fitscoreForm = document.getElementById("fitscore-form");

if (fitscoreForm) {
  fitscoreForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nomeInput = document.getElementById("candidato-nome");
    const emailInput = document.getElementById("candidato-email");
    const selectedOptions = fitscoreForm.querySelectorAll(
      'input[type="radio"]:checked'
    );

    if (selectedOptions.length < 10 || !emailInput.value) {
      alert("Por favor, preencha o e-mail e responda todas as 10 perguntas.");
      return;
    }

    let totalScore = 0;
    selectedOptions.forEach((option) => {
      totalScore += parseInt(option.dataset.score);
    });

    let classificationText = "";
    if (totalScore >= 80) {
      classificationText = "Fit Altíssimo";
    } else if (totalScore >= 60) {
      classificationText = "Fit Aprovado";
    } else if (totalScore >= 40) {
      classificationText = "Fit Questionável";
    } else {
      classificationText = "Fora do Perfil";
    }

    const resultadoDiv = document.getElementById("resultado-final");
    document.getElementById("score-value").textContent = totalScore;
    document.getElementById("classification-value").textContent =
      classificationText;
    resultadoDiv.style.display = "block";

    const respostas = {};
    selectedOptions.forEach((option) => {
      respostas[option.name] = parseInt(option.dataset.score);
    });

    const dadosParaSalvar = {
      nome: nomeInput.value,
      email: emailInput.value,
      score: totalScore,
      classification: classificationText,
      respostas: respostas,
    };

    const submitButton = fitscoreForm.querySelector("button");
    submitButton.disabled = true;
    submitButton.textContent = "Enviando...";

    const { data, error } = await supabaseClient
      .from("candidatos")
      .insert([dadosParaSalvar]);

    if (error) {
      console.error("ERRO DO SUPABASE:", error);
      alert(
        "Ocorreu um erro ao salvar seu formulário. Verifique o console para mais detalhes."
      );
      submitButton.disabled = false;
      submitButton.textContent = "Calcular Meu FitScore";
    } else {
      console.log("Dados salvos com sucesso!", data);

      fetch(
        "https://alvarodev.app.n8n.cloud/webhook/ed2c8eaa-9f92-419f-8b70-0a80ba157d24",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dadosParaSalvar),
        }
      ).catch((error) => {
        console.error("Erro ao enviar para o n8n:", error);
      });

      alert("Seu formulário foi enviado com sucesso! Você será redirecionado.");
      window.location.href = "../dashboard/dashboard.html";
    }
  });
}
