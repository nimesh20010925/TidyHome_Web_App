import React from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

const DeleteConformationbox = ({ isOpen, toggle, handleDelete, selectedMember }) => {
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>Confirm Delete</ModalHeader>
            <ModalBody>
                <p>Are you sure you want to delete <strong>{selectedMember?.name}</strong>?</p>
                <div className="text-end">
                    <Button color="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button color="secondary" className="ms-2" onClick={toggle}>
                        Cancel
                    </Button>
                </div>
            </ModalBody>
        </Modal>
    );
};

export default DeleteConformationbox;
