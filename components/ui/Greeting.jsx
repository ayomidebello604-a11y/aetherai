import React from 'react';
export default function Greeting() {
     const hour =  new Date().getHours();
  let greetingText;

  switch (true) {
    case hour >= 5 && hour < 12:
      greetingText = "Good morning";
      break;
    case hour >= 12 && hour < 17:
      greetingText = "Good afternoon";
      break;
    case hour >= 17 && hour < 23:
          greetingText = "Good evening";
      break;
      case hour >= 23 || hour < 4:
          greetingText = "Midnight owl!";
          break;
    default:
      greetingText = "Good day";
  }

  return <span>{greetingText}</span>;
}
