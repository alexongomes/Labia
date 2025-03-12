async function iniciaGravacao() {
  const status = document.getElementById("status");
  const respostaText = document.getElementById("resposta");
  const perguntaText = document.getElementById("pergunta");

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    alert("Seu navegador não suporta gravação de áudio.");
    return;
  }

  try {
    // Solicita permissão do usuário para acessar o microfone
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const mediaRecorder = new MediaRecorder(stream);
    const audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      const formData = new FormData();
      formData.append("file", audioBlob, "audio.webm");

      status.innerText = "Enviando áudio...";
      console.log("Enviando áudio...");

      try {
        const response = await fetch("speechtotext", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Erro ao enviar áudio: ${response.statusText}`);
        }

        const data = await response.json();
        perguntaText.value = data.text || "Erro na transcrição";
      } catch (error) {
        console.error("Erro na requisição: ", error);
        perguntaText.value = "Erro ao processar áudio";
      }
    };

    mediaRecorder.start();
    status.innerText = "Gravando por 5 segundos...";

    setTimeout(() => {
      mediaRecorder.stop();
      stream.getTracks().forEach((track) => track.stop());
    }, 5000);
  } catch (error) {
    console.error("Erro ao acessar o microfone: ", error);
    alert("Erro ao acessar o microfone. Verifique as permissões do navegador.");
  }

  setTimeout(resposta, 12000);
}

async function resposta() {
  try {
    const message = document.getElementById("pergunta").value;
    console.log(document.getElementById("pergunta").value);
    const response2 = await fetch("/api/text/resposta", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!response2.ok) {
      const errorData = await response2.json();
      throw new Error(errorData.error || "Erro desconhecido na API");
    }

    const data2 = await response2.text();
    document.getElementById("resposta").value =
      (await data2) || "Erro na resposta";
  } catch (error) {
    console.error("Erro:", error.message);
    alert("Erro: " + error.message);
  }

  status.innerText = "Transcrição concluída";
  await textToSpeech();
}
async function textToSpeech() {
  const text = document.getElementById("resposta").value;
  const response = await fetch("/speak", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });

  if (response.ok) {
    const audioPlayer = document.getElementById("audioPlayer");
    audioPlayer.src = URL.createObjectURL(await response.blob());
    audioPlayer.play();
    status.innerText = "Respondendo...";
  } else {
    alert("Erro ao gerar áudio.");
  }
}
