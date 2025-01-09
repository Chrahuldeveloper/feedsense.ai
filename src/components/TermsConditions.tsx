import React from "react";
import { RxCross2 } from "react-icons/rx";

interface Props {
  setistoggle: (value: boolean) => void;
}

const TermsConditions: React.FC<Props> = ({ setistoggle }) => {
  const termsAndConditionsData = [
    {
      section: "Terms and Conditions",
      content: [
        "The content of the pages of this website is subject to change without notice.",
        "Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors, and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.",
        "Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.",
        "Our website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, look, appearance, and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.",
        "All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.",
        "Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.",
        "From time to time, our website may also include links to other websites. These links are provided for your convenience to provide further information.",
        "You may not create a link to our website from another website or document without CHALURKAR RAHUL’s prior written consent.",
        "Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.",
        "We shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any transaction, on account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time.",
      ],
    },
    {
      section: "Cancellation and Refund",
      content: [
        "Cancellations will be considered only if the request is made within 2-3 days of placing the order. However, the cancellation request may not be entertained if the orders have been communicated to the vendors/merchants and they have initiated the process of shipping them.",
        "CHALURKAR RAHUL does not accept cancellation requests for perishable items like flowers, eatables, etc. However, a refund/replacement can be made if the customer establishes that the quality of product delivered is not good.",
        "In case of receipt of damaged or defective items, please report the same to our Customer Service team. The request will, however, be entertained once the merchant has checked and determined the same at their own end. This should be reported within 2-3 days of receipt of the products.",
        "In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within 2-3 days of receiving the product. The Customer Service Team, after looking into your complaint, will take an appropriate decision.",
        "In case of complaints regarding products that come with a warranty from manufacturers, please refer the issue to them.",
        "In case of any refunds approved by CHALURKAR RAHUL, it’ll take 3-5 days for the refund to be processed to the end customer.",
      ],
    },
    {
      section: "Shipping and Delivery",
      content: [
        "For international buyers, orders are shipped and delivered through registered international courier companies and/or International speed post only.",
        "For domestic buyers, orders are shipped through registered domestic courier companies and/or speed post only.",
        "Orders are shipped within 0-7 days or as per the delivery date agreed at the time of order confirmation, and delivering of the shipment is subject to courier company/post office norms.",
        "CHALURKAR RAHUL is not liable for any delay in delivery by the courier company/postal authorities and only guarantees to hand over the consignment to the courier company or postal authorities within 0-7 days from the date of the order and payment or as per the delivery date agreed at the time of order confirmation.",
        "Delivery of all orders will be to the address provided by the buyer.",
        "Delivery of our services will be confirmed to your email ID as specified during registration.",
        "For any issues in utilizing our services, you may contact our helpdesk at 8317680338 or chrahulofficial@gmail.com.",
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm">
      <div className="p-6 max-w-4xl mx-auto bg-[#121212] rounded-lg shadow-md h-[90vh] overflow-y-scroll">
        <div className="flex justify-end">
          <RxCross2
            size={28}
            color="#9ca3af"
            className="cursor-pointer"
            onClick={() => setistoggle(false)}
          />
        </div>
        <div className="space-y-6">
          {termsAndConditionsData.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h1 className="text-2xl font-bold text-white">{section.section}</h1>
              <ul className="list-disc list-inside text-white space-y-3">
                {section.content.map((paragraph, index) => (
                  <li key={index} className="text-sm">
                    {paragraph}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsConditions;
