import React from 'react'

const SubscriptionCard = () => {
    const subscriptionPlans = [
        {
          id: 1,
          name: "Basic",
          price: 10,
          features: [
            "Collect user feedback",
            "Manual task creation from feedback",
            "Basic analytics",
            "Email support",
            "Up to 100 feedback submissions per month",
          ],
          planType: "basic",
          billingCycle: "monthly", 
        },
        {
          id: 2,
          name: "Premium",
          price: 50, 
          features: [
            "Collect user feedback",
            "Automated task generation from feedback",
            "Advanced analytics and insights",
            "Priority email and chat support",
            "Unlimited feedback submissions",
            "Customizable feedback forms",
            "AI-powered feedback analysis",
            "Integration with project management tools (e.g., Jira, Trello)",
            "Real-time feedback dashboard",
            "Visual feedback tools (screenshot annotations)",
          ],
          planType: "premium",
          billingCycle: "monthly", 
        },
      ];
      
    
  return (
    <div>
      {
        subscriptionPlans.map((itm,idx)=>{
            return (
                <React.Fragment key={idx}>
                    <div className="">

                    </div>
                </React.Fragment>
            )
        })
      }
    </div>
  )
}

export default SubscriptionCard
