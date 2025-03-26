import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

const DeleteModal = ({ id }: { id: number }) => {
    const [open, setOpen] = useState(false);

    const handleDelete = () => {
        console.log(`Xóa item có ID: ${id}`);
        // Gọi API xóa tại đây
        setOpen(false);
    };

    return (
        <>
            <Button variant="contained" color="error" onClick={() => setOpen(true)}>Xóa</Button>
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>Bạn có chắc chắn muốn xóa không?</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Hủy</Button>
                    <Button color="error" onClick={handleDelete}>Xóa</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DeleteModal;
