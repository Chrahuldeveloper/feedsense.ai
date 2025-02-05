const feedbackHandler = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    try {
      const feedback = await request.json();

      const taskInput = {
        prompt: `You are an AI tool specialized in analyzing user feedback to generate precise and impactful website improvement suggestions. Your task is to provide a concise (10-15 characters) and highly relevant suggestion based on the feedback given. Focus on clarity, usability, and direct action. Avoid vague responses. Ensure the suggestion is specific and immediately applicable. Feedback: "${feedback.message}"  Generate an actionable suggestion:`,
      };

      const aiResponse = await env.AI.run(
        "@cf/meta/llama-3-8b-instruct",
        taskInput
      );

      const responseContent = {
        response: aiResponse.response,
      };

      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      };

      return new Response(JSON.stringify(responseContent), { headers });
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Failed to process request" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};

export default feedbackHandler;
