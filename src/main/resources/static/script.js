console.log("NEW JS LOADED");
alert("NEW JS LOADED");

async function ask() {
    try {
        const question = document.getElementById("question").value;

        const res = await fetch("/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain"
            },
            body: question
        });

        if (!res.ok) {
                    const errText = await res.text();
                    document.getElementById("response").innerText = "Server error: " + errText;
                    return;
        }

       const data = await res.json();
               document.getElementById("response").innerText =
                   `${data.message}\n\nTokens: ${data.token}`;

    } catch (err) {
        console.error(err);
        document.getElementById("response").innerText = "Error: " + err.message;
    }
}