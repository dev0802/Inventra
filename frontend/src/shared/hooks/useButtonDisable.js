
import { useState } from "react";

export const useButtonDisable = (phone, password) => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    const buttonDisableHandler = () => {
        if(phone.length === 10 && password.length >=6){
            setIsButtonDisabled(false);
        }
        else{
            setIsButtonDisabled(true);
        }
        
    }

    return [isButtonDisabled, buttonDisableHandler];
}