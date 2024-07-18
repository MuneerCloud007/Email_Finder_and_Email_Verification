import ApiError from "../utils/ApiError.js";
import FolderSchema from "../model/folder.model.js"
const createFolder = async (req, res, next) => {
    try {
        const { foldername, user } = req.body;
        if (!foldername) {
            throw new Error(ApiError.notFound("Folder name is not found"))

        }
        const newFolder = FolderSchema({
            FolderName: foldername,
            user: user
        })
        await newFolder.save()
        req.io.emit('btnLoading', 'New Folder is created make a api call');

        res.status(201).json({
            success: true,
            data: newFolder
        })



    } catch (err) {
        next(err);

    }
}

const getAllFolder = async (req, res, next) => {

    const userId = req.params.id;
    if (!userId) {
        throw new Error(ApiError.badRequest("Pls provide a userId"))
    }

    const data = await FolderSchema.find({ user: userId });
    if (data.length == 0) {
        throw new Error(ApiError.notFound("UserId does't exist"));
    }
    res.status(200).json({
        success: true,
        data: data
    })

}

const updateFolderById = async (req, res, next) => {
    try {
        const { currentFolder, newFolder, socketId } = req.body;
        
        if (!currentFolder || !newFolder) {
            return next(ApiError.badRequest("Please provide the folders"));
        }

        await FolderSchema.findByIdAndUpdate(currentFolder, { checked: false });
        const docs = await FolderSchema.findByIdAndUpdate(newFolder, { checked: true }, { new: true });

        if (!docs) {
            return next(ApiError.badRequest("Please provide a valid ID"));
        }

        if (socketId) {
            req.io.emit('UpdateFolder', {
                success: true,
                data: docs
            });
        }

        return res.status(200).json({
            success: true,
            data: docs
        });
    } catch (err) {
        return next(err);
    }
};


const deleteFolder = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!id) {
            throw new Error(ApiError.badRequest("Pls provide a valid id"));
        }
        const data = await FolderSchema.findByIdAndDelete(id);
        if (!data) {
            throw new Error(ApiError.badRequest("Pls provide a valid id"));
        }
        res.status(200).json({
            success: true,
            data: data
        })
    }
    catch (err) {
        next(err);
    }



}

const renameFolder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (!id) {
            throw new Error(ApiError.badRequest("Pls provide a valid id"));
        }
        if (!name) {
            throw new Error(ApiError.badRequest("Pls provide a valid name"));
        }
        const data = await FolderSchema.findByIdAndUpdate(id, { name: name }, { new: true });
        res.status(200).json({
            success: true,
            data: data
        })
    }
    catch (err) {
        next(err);
    }

}


export { createFolder, getAllFolder, updateFolderById, deleteFolder, renameFolder }
