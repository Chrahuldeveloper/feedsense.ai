import emailjs from "@emailjs/browser";

export default class SendEmail {
  async sendLoginEmail(userEmail: string, UserName: string,message:string) {
    try {
      await emailjs.send(
        "service_e0jwhmo",
        "template_jqe4nwi",
        {
          from_name: "Feedsenseai",
          to_name: UserName,
          from_email: "chrahulofficial@gmail.com",
          to_email: userEmail,
          message: message,
        },
        "UOrD1_W9s2qaOe4rC"
      );
    } catch (error) {
      console.log(error);
    }
  }


}
