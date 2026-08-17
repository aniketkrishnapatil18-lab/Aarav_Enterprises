require('dotenv').config();
const aiService = require('./src/integrations/ai/ai.service');

const knowledge = {
  company_name: 'Aarav Enterprises',
  services: 'Logo Design, Visiting Cards, Brochures, Banners, Menu Cards, Social Media Posts',
  working_hours: 'Monday to Saturday, 9 AM to 7 PM',
  location: 'Pune, Maharashtra',
};
const products = [
  { name: 'Logo Design', starting_price: 999, price_label: 'onwards' },
  { name: 'Visiting Card Design', starting_price: 299, price_label: 'onwards' },
  { name: 'Brochure Design', starting_price: 799, price_label: 'onwards' },
  { name: 'Banner/Flex Design', starting_price: 499, price_label: 'onwards' },
  { name: 'Menu Card Design', starting_price: 599, price_label: 'onwards' },
  { name: 'Social Media Post', starting_price: 199, price_label: 'per post' },
];

const testCases = [
  { msg: 'Hello, what services do you offer?', history: [] },
  { msg: 'I want a logo for my bakery called Sweet Treats. I want pink and gold colors.', history: [] },
  { msg: 'How much does a visiting card cost?', history: [] },
  { msg: 'Mujhe ek brochure chahiye apni gym ke liye', history: [] },
  { msg: 'माझ्या रेस्टॉरंटसाठी मेनू कार्ड हवे आहे. नाव आहे "आनंद ढाबा"', history: [] },
];

async function run() {
  for (const tc of testCases) {
    console.log('\n' + '='.repeat(60));
    console.log('CUSTOMER:', tc.msg);
    const result = await aiService.processMessage({
      userMessage: tc.msg,
      language: 'en',
      conversationHistory: tc.history,
      collectedData: {},
      serviceContext: null,
      knowledge,
      products,
    });
    console.log('AI REPLY:', result.message);
    console.log('COLLECTED:', JSON.stringify(result.collectedData));
    await new Promise(r => setTimeout(r, 1000));
  }
}

run().catch(console.error);
