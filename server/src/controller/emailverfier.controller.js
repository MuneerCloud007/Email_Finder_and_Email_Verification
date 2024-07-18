// src/controllers/webscrapeController.js
import WebscrapingData from '../webscraping/webscrap.js';
import ApiError from '../utils/ApiError.js';
import { URL } from 'url';
import wrapperFunEmailVerfier from "../email_verfication/emailVerfier.algo.js";
import axios from "axios"
import emailVerificationModel from '../model/emailverfier.model.js';
import mongoose from 'mongoose';
import companyInfoModel from '../model/companyInfo.js';
import userSchema from "../model/user.model.js";
import creditSchema from "../model/credit.model.js";
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function extractDomain(url) {
    // Remove protocol (http, https) and www from URL
    let domain = url.replace(/(^\w+:|^)\/\//, '').replace('www.', '');

    // Remove path and query string
    domain = domain.split('/')[0];

    return domain;
}

const scrapeController = async (req, res, next) => {
    const { firstName, lastName, user, position, folder, url, socketId,cookieData} = req.body;
    console.log(req.body);

    if (!url) {
        return next(ApiError.badRequest('URL is required'));
    }

    try {
        // Web scraping has started
        const company_data = await WebscrapingData(url,cookieData);
        console.log("COMPANY DATA");
        console.log(company_data);

        // Email verification is started
        const url1 = 'https://app.icypeas.com/api/email-search';
        const EmailVerifierData = {
            firstname: firstName.toLowerCase(),
            lastname: lastName.toLowerCase(),
            domainOrCompany: extractDomain(company_data["website"])
        };
        const headers = {
            'Authorization': '41b965a9f0a544f1aa43df5bcdaf58168a48bf9dfeb648ac8dc4863d5316498b',
            'Content-Type': 'application/json'
        };
        const response1 = await axios.post(url1, EmailVerifierData, { headers });
        // console.log(response1.data);
        await delay(2000);

        const url2 = "https://app.icypeas.com/api/bulk-single-searchs/read";
        const EmailVerifierData2 = {
            "user": "LUx6tZABOIKatkTjs8LF",
            "mode": "single",
            "id": response1.data["item"]["_id"]
        };
        const response2 = await axios.post(url2, EmailVerifierData2, { headers });
        // console.log(response2.data);
        // console.log("ITEMS Data");
        // console.log(response2.data["items"][0]["results"]["emails"][0]["email"]);

        const createCompanyInfo = new companyInfoModel({
            firstName,
            lastName,
            position,
            ...company_data,
            verifiedEmail: response2.data["items"][0]["results"]["emails"][0]["email"]
        });
        const newCompanyInfo = await createCompanyInfo.save();

        console.log("New company Info---------------------------------------------------------");

        const emailArr = await emailVerificationModel.find({ $and: [{ user: user }, { folder: folder }] });
        console.log("Email Array ---------------------------------------------------------------------------------------------");
       
       let creditData=await creditSchema.findOneAndUpdate(
            { user: user }, // Filter to find the Credit document by _id
            { $inc: { points: -1 } }, // Decrement the amount field by amountToDecrement
            { new: true } // Return the updated document
        );
        console.log(creditData);

        let createEmailVerifier;
        if (emailArr.length == 0) {
            createEmailVerifier = new emailVerificationModel({
                "companyInfo": newCompanyInfo["_id"],
                "user": user,
                "folder": folder
            });
            createEmailVerifier = await createEmailVerifier.save();
        } else {
            createEmailVerifier = emailArr[0];
            const dummyValue = await emailVerificationModel.populate(createEmailVerifier, { path: 'companyInfo' });
            console.log("........................-Dummy value -............................")
            console.log(dummyValue[0]);
            const dummyArray = dummyValue.companyInfo[0].dynamicFields.reduce((current, vl) => {
                current.push({
                    name: vl.name,
                    value: '',
                    _id: new mongoose.Types.ObjectId()  // Dynamically create _id
                });
                return current;
            }, []);

            newCompanyInfo["dynamicFields"] = [...dummyArray]; // Correctly handling the population
            newCompanyInfo["user"]=user;
            await newCompanyInfo.save();

            createEmailVerifier["companyInfo"].push(newCompanyInfo["_id"]);
            await createEmailVerifier.save();
        }

        let companyInfo = newCompanyInfo;
        console.log(companyInfo);

        let data = {
            firstName: companyInfo.firstName,
            lastName: companyInfo.lastName,
            img: companyInfo.img,
            company: companyInfo.company,
            position: companyInfo.position,
            website: companyInfo.website,
            employees: companyInfo.employees,
            industry: companyInfo.industry,
            revenue: companyInfo.revenue,
            country: companyInfo.country,
            description: companyInfo.description.replace(/\n/g, ' ').replace(/\s\s+/g, ' ').trim(),
            header_quater: companyInfo.header_quater,
            type: companyInfo.type,
            createdAt: companyInfo.createdAt,
            updatedAt: companyInfo.updatedAt,
            companyInfoId: companyInfo._id,
            verifiedEmail: response2.data["items"][0]["results"]["emails"][0]["email"]
        };

        let key = companyInfo.firstName + " " + companyInfo.lastName;
        let result = {};
        result[key] = {
            id: createEmailVerifier._id,
            ...data,
            folder: createEmailVerifier.folder,
            user: createEmailVerifier.user
        };

        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

        if (socketId) {
            req.io.emit("postEmailVerifier", {
                success: true,
                data: result
            });
        }


        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        return next(ApiError.internal(error?.message || 'Failed to scrape the website'));
    }
};



const findEmailVerifierController = async (req, res, next) => {
    const { user, folder } = req.body;
    console.log(user);
    console.log(folder);
    try {
        if (!user) {
            next(ApiError.notFound("There is no user"));
            return;
        }


        let arr = await emailVerificationModel.findOne({ $and: [{ user: new mongoose.Types.ObjectId(user) }, { folder: new mongoose.Types.ObjectId(folder) }] }).populate('companyInfo');;



        console.log("POPULATE COMPANY INFO")
        console.log(arr);

        if (!arr) {
            return res.status(200).json({
                success: true,
                data: {}
            });

        }


        let result = arr["companyInfo"].reduce((current, value) => {
            const companyInfo = value;
            let data = {
                firstName: companyInfo.firstName,
                lastName: companyInfo.lastName,
                img: companyInfo.img,
                company: companyInfo.company,
                position: companyInfo.position,
                website: companyInfo.website,
                employees: companyInfo.employees,
                industry: companyInfo.industry,
                revenue: companyInfo.revenue,
                country: companyInfo.country,
                description: companyInfo.description.replace(/\n/g, ' ').replace(/\s\s+/g, ' ').trim(),
                header_quater: companyInfo.header_quater,
                type: companyInfo.type,
                verifiedEmail: companyInfo["verifiedEmail"] || "Before data",

                createdAt: companyInfo.createdAt,
                updatedAt: companyInfo.updatedAt,
                companyInfoId: companyInfo._id
            };
            if (companyInfo["dynamicFields"].length > 0) {
                companyInfo["dynamicFields"].forEach((dynamicField) => {
                    data[dynamicField.name] = dynamicField.value;
                });

            }


            let key = companyInfo.firstName + " " + companyInfo.lastName;
            current[key] = {
                id: value._id,
                ...data,
                folder: value.folder,
                user: value.user
            };
            return current;
        }, {});

        console.log(result);
        res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        next(ApiError.internal(err.message || "Internal Error"));
    }
};

const putEmailVerifierController = async (req, res, next) => {

}



const findEmailVerifierById = async (req, res, next) => {
    const objectId = req.params.id;
    if (!objectId) {
        next(ApiError.badRequest("Please provide a objectId"))
    }
    try {
        const data = await emailVerificationModel.findById(objectId);
        if (!data) {
            throw new Error(ApiError.badRequest("Please provide a correct objectId"))

        }
        console.log(data);
        const groupedData = {};

        groupedData[data.url] = data;




        res.header("Content-Type", "application/json");
        res.status(200).json({
            sucess: "true",
            data: groupedData
        })



    }
    catch (err) {
        next(err);
    }





}


const updateByIdCell = async (req, res, next) => {
    const userId = req.params.id;
    const { colName, colValue, colId } = req.body;
    let updateData = []
    console.log("Update BY ID Cell---------------------")
    console.log(userId);
    console.log(colName);
    console.log(colValue);
    console.log(colId);

    if (!userId) {
        next(ApiError.badRequest("Please provide a objectId"))
    }
    try {
        let updateData;
        if (!colName.startsWith("custom-column-")) {
            console.log(colName);
            console.log(colValue);
            const update = {
                $set: {
                    [colName]: colValue
                }
            };

            // Perform the update
            updateData = await companyInfoModel.updateOne(
                { user: userId, _id: colId },
                update
            );

        }



        else {

            console.log("CUSTOM COLUMN !!!!");
            updateData = await companyInfoModel.findOne({ $and: [{ user: userId }, { _id: colId }] });
            if (!updateData) {
                throw new Error(ApiError.badRequest("Please provide a correct objectId"))
            }
            console.log(updateData);

            for (let i in updateData["dynamicFields"]) {
                console.log(i);
                const customColumn = updateData["dynamicFields"][i];
                console.log(customColumn["name"] == colName);
                if (customColumn["name"] == colName) {
                    updateData["dynamicFields"][i]["value"] = colValue
                }

            }
            await updateData.save();



        }


        res.header("Content-Type", "application/json");


        res.status(200).json({
            sucess: "true",
            data: updateData
        })
    }
    catch (err) {
        next(err);
    }

}
const addColumn = async (req, res, next) => {
    try {
        const { userId, colName, folder } = req.body;

        let emailDocs = await emailVerificationModel.find({ $and: [{ user: userId }, { folder: folder }] });

        if (!emailDocs || emailDocs.length === 0) {
            throw new Error('Email verification documents not found for user and folder');
        }

        let arrayOfIds = emailDocs.map(doc => doc.companyInfo);

        arrayOfIds = arrayOfIds.flat();

        const arrayOfObjectIds = arrayOfIds.map(id => new mongoose.Types.ObjectId(id));

        // Find company info documents using $in operator with arrayOfObjectIds
        let companyInfoDocs = await companyInfoModel.find({ "_id": { $in: arrayOfObjectIds } });

        if (!companyInfoDocs || companyInfoDocs.length === 0) {
            throw new Error('Company info documents not found for the provided IDs');
        }

        const updateData = [];

        // Update each company info document
        for (let companyInfoDoc of companyInfoDocs) {
            companyInfoDoc.dynamicFields.push({ name: colName, value: "" });
            const updatedDoc = await companyInfoDoc.save();
            updateData.push(updatedDoc);
        }

        res.status(200).json({ success: true, data: updateData });
    } catch (error) {
        console.error("Error adding dynamic column:", error);
        next(error);
    }
};

const addRow = async (req, res, next) => {
    try {
        const { userId, folder } = req.body;
        console.log(userId);
        console.log(folder);
        let emailDocs = await emailVerificationModel.find({ $and: [{ user: userId }, { folder: folder }] });
        console.log(emailDocs);
        if ((!emailDocs || !emailDocs[0]?.companyInfo.length > 0)) {
            let companyInfo = companyInfoModel({ folder, user: userId, dynamicFields: [] })
            companyInfo = await companyInfo.save()

            const createEmailVerifier = await emailVerificationModel({
                "user": userId,
                "folder": folder,
                "companyInfo": companyInfo["_id"]

            })
            emailDocs = await createEmailVerifier.save();
            emailDocs = [emailDocs];

            let data = {
                firstName: companyInfo.firstName,
                lastName: companyInfo.lastName,
                img: companyInfo.img,
                company: companyInfo.company,
                position: companyInfo.position,
                website: companyInfo.website,
                employees: companyInfo.employees,
                industry: companyInfo.industry,
                revenue: companyInfo.revenue,
                country: companyInfo.country,
                description: '',
                header_quater: companyInfo.header_quater,
                type: companyInfo.type,
                createdAt: companyInfo.createdAt,
                updatedAt: companyInfo.updatedAt,
                id: companyInfo._id,
                user: userId
            };

            res.status(200).json({
                success: true,
                data: { ...data }


            })
            return;
        }
        console.log("I am executing !!!!");
        let arrayOfIds = emailDocs.map(doc => doc.companyInfo);

        arrayOfIds = arrayOfIds.flat();

        const dummyInfo = await companyInfoModel.find({ "_id": arrayOfIds[0] });
        console.log("dummyInfo[0]");
        console.log(dummyInfo[0]["dynamicFields"]);

        // Assuming dummyInfo[0]["dynamicFields"] is an array of objects
        let dummyData = dummyInfo[0]["dynamicFields"].reduce((acc, current) => {
            // Add a new object to the accumulator array with the desired properties
            acc.push({
                name: current.name,
                value: ""
            });
            return acc;
        }, []);

        console.log(dummyData);

        let companyInfo = companyInfoModel({ firstName: "", user: userId, dynamicFields: dummyData });
        companyInfo = await companyInfo.save()
        // companyInfo= companyInfo["_id"],

        const createEmailVerifier = emailDocs[0];

        dummyData = dummyData.reduce((acc, current) => {
            const key = current.name;
            acc[key] = "";
            return acc;
        }, {});
        delete companyInfo["dynamicFields"];
        createEmailVerifier["companyInfo"].push(companyInfo["_id"]);
        const newEmailVerifierData = await createEmailVerifier.save();


        let data = {
            firstName: companyInfo.firstName,
            lastName: companyInfo.lastName,
            img: companyInfo.img,
            company: companyInfo.company,
            position: companyInfo.position,
            website: companyInfo.website,
            employees: companyInfo.employees,
            industry: companyInfo.industry,
            revenue: companyInfo.revenue,
            country: companyInfo.country,
            description: companyInfo.description.replace(/\n/g, ' ').replace(/\s\s+/g, ' ').trim(),
            header_quater: companyInfo.header_quater,
            type: companyInfo.type,
            createdAt: companyInfo.createdAt,
            updatedAt: companyInfo.updatedAt,
            id: companyInfo._id,
            user: userId
        };

        res.status(200).json({
            success: true,
            data: { ...data, ...dummyData }


        })


    }
    catch (err) {
        next(err);

    }
}
const removeRow = async (req, res, next) => {
    try {
        const { data } = req.body;
        console.log("I AM INSEIDE ROW DELETE");
        if (!data) {
            next(ApiError.badRequest("Please provide a please deletion array"))
        }


        const deletionPromises = data.map(id => companyInfoModel.findByIdAndDelete(id));

        // Wait for all deletions to complete
        const results = await Promise.all(deletionPromises);
        res.status(200).json({
            success: true,
            data: results
        })

    }
    catch (err) {
        next(err);

    }
}

const companyInfo = async (req, res, next) => {
    try {
        const companyData = await companyInfoModel.find({});
        res.status(200).json({ success: true, data: companyData });
    }
    catch (err) {
        next(err);

    }
}

const postEmailTableData = async (req, res, next) => {
    try {
        const { colName, user, colValue, folder, dummyColumn } = req.body
        if (!colName || !colValue || !user || !dummyColumn) {
            throw new Error('Please provide all the fields')
        }
        let companyInfo = companyInfoModel({ [colName]: colValue, user, dynamicFields: [...dummyColumn] })
        companyInfo = await companyInfo.save()
        // companyInfo= companyInfo["_id"],

        const createEmailVerifier = await emailVerificationModel.findOne({
            "user": user,
            "folder": folder

        })
        createEmailVerifier["companyInfo"].push(companyInfo["_id"]);
        const newEmailVerifierData = await createEmailVerifier.save();

        res.status(200).json({ success: true, data: newEmailVerifierData, companyInfo: companyInfo });


    }
    catch (err) {
        next(err);

    }
}





export {
    scrapeController,
    findEmailVerifierController,
    findEmailVerifierById,
    updateByIdCell,
    addColumn,
    companyInfo,
    postEmailTableData,
    addRow,
    removeRow
}
