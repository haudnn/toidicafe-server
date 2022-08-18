import app from "./src/app";
import dotenv from "dotenv";
dotenv.config();
const port = process.env.PORT;
app.listen(port, (): void => {
  console.log(`Server is running on port ${port || "5000"} `);
});



