"use strict";
const httpStatus = require('http-status');
const { mysqlHelper, jwtHelper } = require("./../../../helpers");
const { balanceHumanityValidator } = require("./../helpers");
const bcrypt = require('bcrypt');

(() => {

    module.exports = async (call, res) => {

        try {


            let response = await balanceHumanityValidator.loginCustomer(call.body);
            if (response.status !== httpStatus.OK) {
                return res.status(400).json({ message: response.message });
            }

            let userExistCheck = await mysqlHelper.format(`SELECT uuid, customer_pin, password,email,mobile_number,
        case when customer_type= 1 then "NormalCustomer"
        when customer_type = 2 then "VictimCustomer"
        when customer_type = 3 then "superCustomer" 
        end as customerType 
 

         FROM sagar_test.balance_humanity_users WHERE mobile_number = "${call.body.mobileNumber}"`);
            let [userExistCheckResult] = await mysqlHelper.query(userExistCheck);

            if (!userExistCheckResult || userExistCheckResult.length === 0) {
                return res.status(400).json({ message: "User doesnt exist!" });
            }
            if (userExistCheckResult && userExistCheckResult.length > 0) {
                const match = await bcrypt.compare(call.body.password, userExistCheckResult[0].password);

                if (match) {
                    const jwtToken = jwtHelper.generateJWTToken(userExistCheckResult[0].uuid)
                    let customerData =
                    {
                        mobileNumber: userExistCheckResult[0].mobile_number,
                        email: userExistCheckResult[0].email,
                        customerType: userExistCheckResult[0].customerType
                    }

                    if (jwtToken.success) {
                        return res.status(200).json({ token: jwtToken, message: "login successfully!", customerData: JSON.stringify(customerData) });
                    }


                }

                else {
                    return res.status(401).json({ message: "Invalid password." });

                }

            }



        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal Server Error" });
        }

    }

})
    ();
