// import { doc, setDoc } from "firebase/firestore";
// import { useEffect } from "react";
// import { db } from "../services/config";

// export default function TestScreen() {

//   useEffect(() => {
//       console.log("⚡ TestScreen mounted");
//     const writeTest = async () => {
//       await setDoc(doc(db, "test", "ios-check"), {
//         ok: true,
//         platform: "ios",
//         time: Date.now()
//       });

//       console.log("🔥 Firestore write success");
//     };

//     writeTest();
//   }, []);

//   return null;
// }
