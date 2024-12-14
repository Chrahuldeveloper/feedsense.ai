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
        prompt: `You are an AI tool designed to analyze user feedback and provide actionable suggestions for website improvements. Based on the feedback provided, generate a concise and actionable suggestion (10–15 characters) that directly addresses the user's concern or highlights an improvement area: "${feedback.message}"`,
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
