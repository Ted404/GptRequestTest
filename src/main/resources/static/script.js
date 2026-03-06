async function ask() {

    const question = document.getElementById("question").value;

    const res = await fetch("/api/ask", {
        method: "POST",
        headers: {
            "Content-Type": "text/plain"
        },
        body: question
    });

    const data = await res.json();

    document.getElementById("response").innerText =
        data.message + " (tokens: " + data.tokens + ")";
}