
import { useState } from "react";

export const useButtonDisable = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const buttonDisableHandler = (latestPassword) => {
        if(latestPassword.length >= 6){
            setIsButtonDisabled(false);
        }
        else {
            setIsButtonDisabled(true);
        }
    }

    return [isButtonDisabled, buttonDisableHandler];
}