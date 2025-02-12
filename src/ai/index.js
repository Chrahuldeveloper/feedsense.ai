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
        prompt: `Analyze the user feedback and generate a precise, impactful website improvement suggestion (10-15 characters). Focus on usability, clarity, and user experience. Ensure the suggestion addresses the core issue and provides meaningful guidance. Feedback: "${feedback.message}" Suggestion:`,
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
