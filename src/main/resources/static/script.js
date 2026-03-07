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

        const raw = await res.text();
        console.log("RAW RESPONSE:", raw);

        document.getElementById("response").innerText = raw;
    } catch (err) {
        console.error(err);
        document.getElementById("response").innerText = "Error: " + err.message;
    }
}