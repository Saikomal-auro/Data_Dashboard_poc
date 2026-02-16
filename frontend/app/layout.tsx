"use client";
 
import { CopilotKit } from "@copilotkit/react-core";

import "@copilotkit/react-ui/styles.css";

import "./globals.css";

 
// Assuming the new API setup is already handled server-side as described in the second part

export default function RootLayout({

  children,

}: {

  children: React.ReactNode;

}) {

  return (
<html lang="en">
<body>
<CopilotKit runtimeUrl="/api/copilotkit"
  showDevConsole={false}
  
>


          {children}
</CopilotKit>
</body>
</html>

  );

}