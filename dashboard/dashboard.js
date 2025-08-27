const SUPABASE_URL = "https://qsvlkwavpfcnkkkfqorq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzdmxrd2F2cGZjbmtra2Zxb3JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMjM0MDAsImV4cCI6MjA3MTc5OTQwMH0.AA_aWmq-10vaa1cKoDTXThsJobZ9F-Ln7g4c0WysNtE";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const loadingState = document.getElementById("loading-state");
const emptyState = document.getElementById("empty-state");
const errorState = document.getElementById("error-state");
const candidatosList = document.getElementById("candidatos-list");
const filterButtons = document.querySelectorAll(".filter-btn");

let todosCandidatos = [];

async function fetchCandidatos() {
  loadingState.style.display = "block";
  emptyState.style.display = "none";
  errorState.style.display = "none";
  candidatosList.innerHTML = "";

  const { data, error } = await supabaseClient
    .from("candidatos")
    .select("*")
    .order("score", { ascending: false });

  loadingState.style.display = "none";

  if (error) {
    console.error("Erro ao buscar candidatos:", error);
    errorState.style.display = "block";
  } else if (data.length === 0) {
    emptyState.style.display = "block";
  } else {
    todosCandidatos = data;
    renderCandidatos(todosCandidatos);
  }
}

function renderCandidatos(candidatos) {
  candidatosList.innerHTML = "";
  if (candidatos.length === 0) {
    emptyState.style.display = "block";
    return;
  }
  emptyState.style.display = "none";

  candidatos.forEach((candidato) => {
    const candidatoCard = document.createElement("div");
    candidatoCard.classList.add("candidato-card");
    const classificationClass = candidato.classification
      .toLowerCase()
      .replace(" ", "-");

    candidatoCard.innerHTML = `
    <h3>${candidato.nome || "Nome não informado"}</h3>
    <p><strong>E-mail:</strong> ${candidato.email}</p>
    <p><strong>FitScore:</strong> ${candidato.score}</p>
    <p><strong>Classificação:</strong> <span class="classification ${classificationClass}">${
      candidato.classification
    }</span></p>
`;
    candidatosList.appendChild(candidatoCard);
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const filterValue = button.dataset.filter;

    if (filterValue === "all") {
      renderCandidatos(todosCandidatos);
    } else {
      const candidatosFiltrados = todosCandidatos.filter(
        (candidato) => candidato.classification === filterValue
      );
      renderCandidatos(candidatosFiltrados);
    }
  });
});

document.addEventListener("DOMContentLoaded", fetchCandidatos);
