async function convertTextToSpeech() {
    const text = document.getElementById("textInput").value;
    const response = await fetch("/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
    });

    if (response.ok) {
        const audioPlayer = document.getElementById("audioPlayer");
        audioPlayer.src = URL.createObjectURL(await response.blob());
        audioPlayer.play();
    } else {
        alert("Erro ao gerar áudio.");
    }
}