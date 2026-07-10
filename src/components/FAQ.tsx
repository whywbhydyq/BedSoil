const faq = [
  ['How much soil do I need for a 4x8 raised bed?', 'A 4×8 bed filled 12 inches deep needs 32 cubic feet, or about 1.19 cubic yards, before any settling allowance.'],
  ['How many bags of soil do I need for a raised bed?', 'Divide the required cubic feet by the bag volume in cubic feet, then round up. The calculator does this automatically.'],
  ['Should I add extra soil for settling?', 'Many gardeners add 10–15% for initial settling, especially when compost-heavy material is used.'],
  ['What is the difference between cubic feet and cubic yards?', 'One cubic yard is 27 cubic feet. Bulk soil is usually sold by the cubic yard; bags are often labeled in cubic feet, dry quarts, or liters.'],
  ['Is 40 lb of soil the same as 40 quarts?', 'No. Pounds measure weight, while quarts measure volume. Soil weight changes with moisture and material density.'],
  ['How deep should a raised bed be?', 'Six to eight inches can work for shallow greens and herbs. Tomatoes, peppers, squash, and longer root crops usually benefit from 12 inches or more.'],
];
export function FAQ() {
  return <section className="content-card"><h2>FAQ</h2>{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</section>;
}
