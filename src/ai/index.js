export default class Analyse {
  async fetch(request, env) {
    const tasks = [];

    const feedback = await request.json();

    const taskInput = {
      prompt: `Convert the following feedback into a short actionable task that is between 15 and 20 characters long: ${feedback.message}`,
    };

    let response = await env.AI.run("@cf/meta/llama-3-8b-instruct", taskInput);
    tasks.push({ inputs: taskInput, response });
    return Response.json(tasks);
  }
};
