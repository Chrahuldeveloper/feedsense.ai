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
        prompt: `You are an AI tool designed to analyze feedback and provide actionable suggestions for improvements. Based on the following feedback, give a clear and concise suggestion that is between 10 and 15 characters long: "${feedback.message}"`,
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
