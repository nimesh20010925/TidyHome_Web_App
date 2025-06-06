import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import Form from "react-bootstrap/Form";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaEdit, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";

const ShoppingListDisplay = () => {
    const [shoppingLists, setShoppingLists] = useState([]);
    const [filteredLists, setFilteredLists] = useState([]); // For search results
    const [currentList, setCurrentList] = useState(null);
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        listName: "",
        shoppingDate: "",
        shopVisitors: [],
    });
    const [homeMembers, setHomeMembers] = useState([]);
    const [errors, setErrors] = useState({});
    const [createShoppingScheduleModal, setCreateShoppingScheduleModal] =
        useState(false);
    const [updateShoppingScheduleModal, setUpdateShoppingScheduleModal] =
        useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // For search input

    // Add this useEffect to initialize filteredLists when shoppingLists changes
    useEffect(() => {
        setFilteredLists(shoppingLists);
    }, [shoppingLists]);

    const createShoppingScheduleToggle = () => {
        setCreateShoppingScheduleModal(!createShoppingScheduleModal);
        if (!createShoppingScheduleModal) {
            setFormData({
                listName: "",
                shoppingDate: "",
                shopVisitors: [],
            });
            setCurrentList(null);
        }
    };

    const updateShoppingScheduleToggle = () =>
        setUpdateShoppingScheduleModal(!updateShoppingScheduleModal);

    useEffect(() => {
        fetchShoppingLists();
        fetchHomeMembers();
    }, []);

    const fetchShoppingLists = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:3500/api/shoppingList/shopping-lists",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data && Array.isArray(response.data.shoppingLists)) {
                setShoppingLists(response.data.shoppingLists);
            } else {
                console.error("Unexpected response format:", response.data);
                setShoppingLists([]);
            }
        } catch (error) {
            console.error("Error fetching shopping lists:", error);
            setShoppingLists([]);
        }
    };

    const fetchHomeMembers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
                "http://localhost:3500/api/auth/home/members",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setHomeMembers(response.data.members);
        } catch (error) {
            console.error("Error fetching home members:", error);
        }
    };

    // Add this function to handle search
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        
        if (!term) {
            setFilteredLists(shoppingLists);
            return;
        }

        const filtered = shoppingLists.filter(list => {
            const listNameMatch = list.listName.toLowerCase().includes(term);
            const dateMatch = new Date(list.shoppingDate).toLocaleDateString().includes(term);
            return listNameMatch || dateMatch;
        });

        setFilteredLists(filtered);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleVisitorsChange = (e) => {
        const visitorIds = Array.from(
            e.target.selectedOptions,
            (option) => option.value
        );
        setFormData({ ...formData, shopVisitors: visitorIds });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user || !user.homeID || !user._id) {
                console.error("Missing homeID or user ID in localStorage");
                return;
            }

            const requestData = {
                homeId: user.homeID,
                createdBy: user._id,
                listName: formData.listName,
                shoppingDate: formData.shoppingDate,
                shopVisitors: formData.shopVisitors,
            };

            if (currentList) {
                await axios.put(
                    `http://localhost:3500/api/shoppingList/shopping-lists/${currentList._id}`,
                    requestData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                setFormData({
                    listName: "",
                    shoppingDate: "",
                    shopVisitors: [],
                });
                updateShoppingScheduleToggle();
            } else {
                await axios.post(
                    "http://localhost:3500/api/shoppingList/shopping-lists",
                    requestData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                createShoppingScheduleToggle();
            }

            setCurrentList(null);
            fetchShoppingLists();
        } catch (error) {
            console.error("Error saving shopping list:", error);
        }
    };

    const handleDelete = async (listId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to undo this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (!result.isConfirmed) return;

        const token = localStorage.getItem("token");
        try {
            await axios.delete(
                `http://localhost:3500/api/shoppingList/shopping-lists/${listId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            fetchShoppingLists();
            Swal.fire("Deleted!", "Your shopping list has been deleted.", "success");
        } catch (error) {
            console.error("Error deleting shopping list:", error);
            Swal.fire("Error!", "Something went wrong.", "error");
        }
    };

    const handleEdit = (list) => {
        setFormData({
            listName: list.listName,
            shoppingDate: list.shoppingDate.split("T")[0],
            shopVisitors: list.shopVisitors,
        });
        setCurrentList(list);
        updateShoppingScheduleToggle();
    };

    const getVisitorNames = (visitorIds) => {
        return visitorIds.map((id) => {
            const member = homeMembers.find((member) => member._id === id);
            return member ? member.name : "Unknown Visitor";
        });
    };

    const validateForm = () => {
        const newErrors = {};
        const today = new Date().toISOString().split("T")[0];
        if (!formData.shoppingDate || formData.shoppingDate < today) {
            newErrors.shoppingDate = "Shopping date cannot be in the past.";
        }
        if (formData.shopVisitors.length === 0) {
            newErrors.shopVisitors = "Please select at least one visitor.";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const closeBtn = (
        <button
            className="close-btn"
            onClick={createShoppingScheduleToggle}
            onMouseDown={(e) => e.stopPropagation()}
            type="button"
        >
            <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios/20/cancel.png"
                alt="cancel"
            />
        </button>
    );

    const closeUpdateBtn = (
        <button
            className="close-btn"
            onClick={updateShoppingScheduleToggle}
            onMouseDown={(e) => e.stopPropagation()}
            type="button"
        >
            <img
                width="20"
                height="20"
                src="https://img.icons8.com/ios/20/cancel.png"
                alt="cancel"
            />
        </button>
    );

    return (
        <div className="home-shopping-container">
            <h2 className="home-shopping-h2">{t("SHOPPINGSCHEDULES")}</h2>
            
            {/* Add search bar here */}
            <div className="mb-3 position-relative">
                <div className="input-group">
                    <span className="input-group-text">
                        <FaSearch />
                    </span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or date..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
            </div>

            {localStorage.getItem("user") &&
                JSON.parse(localStorage.getItem("user")).role === "homeOwner" && (
                    <button
                        className="home-shopin-create-btn"
                        onClick={createShoppingScheduleToggle}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        {t("CREATESHOPPINGSCHEDULES")}
                    </button>
                )}

            <div className="home-shopping-list-wrapper">
                {Array.isArray(filteredLists) && filteredLists.length === 0 ? (
                    <p>No shopping lists found{searchTerm ? ` matching "${searchTerm}"` : ""}.</p>
                ) : (
                    Array.isArray(filteredLists) &&
                    filteredLists.map((list) => (
                        <div key={list._id} className="home-shopping-card">
                            <div className="home-shopping-header">
                                <strong>{list.listName}</strong>
                                <span>
                                    {new Date(list.shoppingDate).toISOString().split("T")[0]}
                                </span>
                            </div>
                            <div className="home-shopping-members">
                                {list.shopVisitors && list.shopVisitors.length > 0 ? (
                                    getVisitorNames(list.shopVisitors).map(
                                        (visitorName, index) => <p key={index}>{visitorName}</p>
                                    )
                                ) : (
                                    <p>No visitors</p>
                                )}
                            </div>
                            <div className="home-shopping-actions">
                                {localStorage.getItem("user") &&
                                    JSON.parse(localStorage.getItem("user")).role ===
                                    "homeOwner" && (
                                        <>
                                            <button
                                                className="home-shopping-edit-btn"
                                                onClick={() => handleEdit(list)}
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="home-shopping-delete-btn"
                                                onClick={() => handleDelete(list._id)}
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                <RiDeleteBin6Line />
                                            </button>
                                        </>
                                    )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Rest of your modal code remains the same */}
            <Modal
                className="add-inventory-modal"
                isOpen={updateShoppingScheduleModal}
                toggle={updateShoppingScheduleToggle}
                centered
            >
                <ModalHeader
                    toggle={updateShoppingScheduleToggle}
                    close={closeUpdateBtn}
                    className="border-0 poppins-medium mx-4 mt-2 fw-bold"
                >
                    {t("CREATENEWSHOPPINGLISTFORM")}
                </ModalHeader>

                <ModalBody className="add-inventory-modal-body">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Form.Group className="custom-inventory-form-group">
                                <Form.Control
                                    className="custom-inventory-form-input"
                                    type="text"
                                    name="listName"
                                    value={formData.listName}
                                    onChange={handleInputChange}
                                    required
                                    onMouseDown={(e) => e.stopPropagation()}
                                />
                                <Form.Label>List Name:</Form.Label>
                            </Form.Group>

                            <Form.Group className="custom-inventory-form-group">
                                <Form.Control
                                    type="date"
                                    name="shoppingDate"
                                    value={formData.shoppingDate}
                                    onChange={handleInputChange}
                                    required
                                    min={new Date().toISOString().split("T")[0]}
                                    onMouseDown={(e) => e.stopPropagation()}
                                />
                                <Form.Label>Shopping Date:</Form.Label>
                                {errors.shoppingDate && (
                                    <p className="error-text">{errors.shoppingDate}</p>
                                )}
                            </Form.Group>

                            <Form.Group className="custom-inventory-form-group">
                                <Form.Label>
                                    Shop Visitors: <span className="required">*</span>
                                </Form.Label>
                                <Form.Select
                                    name="shopVisitors"
                                    multiple
                                    value={formData.shopVisitors}
                                    onChange={handleVisitorsChange}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    size={homeMembers.length}
                                >
                                    {homeMembers.map((member) => (
                                        <option key={member._id} value={member._id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.shopVisitors && (
                                    <p className="error-text">{errors.shopVisitors}</p>
                                )}
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 pt-2 pb-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                                style={{
                                    backgroundColor: "#bb87fa",
                                    border: "none",
                                    fontSize: "17px",
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                Update
                            </Button>
                        </form>
                    </div>
                </ModalBody>
            </Modal>

            <Modal
                className="add-inventory-modal"
                isOpen={createShoppingScheduleModal}
                toggle={createShoppingScheduleToggle}
                centered
            >
                <ModalHeader
                    toggle={createShoppingScheduleToggle}
                    close={closeBtn}
                    className="border-0 poppins-medium mx-4 mt-2 fw-bold"
                >
                    {t("CREATENEWSHOPPINGLISTFORM")}
                </ModalHeader>

                <ModalBody className="add-inventory-modal-body">
                    <div>
                        <form onSubmit={handleSubmit}>
                            <Form.Group className="custom-inventory-form-group">
                                <Form.Control
                                    className="custom-inventory-form-input"
                                    type="text"
                                    name="listName"
                                    value={formData.listName}
                                    onChange={handleInputChange}
                                    required
                                    onMouseDown={(e) => e.stopPropagation()}
                                />
                                <Form.Label>List Name:</Form.Label>
                            </Form.Group>

                            <Form.Group className="custom-inventory-form-group">
                                <Form.Control
                                    type="date"
                                    name="shoppingDate"
                                    value={formData.shoppingDate}
                                    onChange={handleInputChange}
                                    required
                                    min={new Date().toISOString().split("T")[0]}
                                    onMouseDown={(e) => e.stopPropagation()}
                                />
                                <Form.Label>Shopping Date:</Form.Label>
                                {errors.shoppingDate && (
                                    <p className="error-text">{errors.shoppingDate}</p>
                                )}
                            </Form.Group>

                            <Form.Group className="custom-inventory-form-group">
                                <Form.Label>
                                    Shop Visitors: <span className="required">*</span>
                                </Form.Label>
                                <Form.Select
                                    name="shopVisitors"
                                    multiple
                                    value={formData.shopVisitors}
                                    onChange={handleVisitorsChange}
                                    onMouseDown={(e) => e.stopPropagation()}
                                    size={homeMembers.length}
                                >
                                    {homeMembers.map((member) => (
                                        <option key={member._id} value={member._id}>
                                            {member.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                {errors.shopVisitors && (
                                    <p className="error-text">{errors.shopVisitors}</p>
                                )}
                            </Form.Group>

                            <Button
                                type="submit"
                                className="w-100 pt-2 pb-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                                style={{
                                    backgroundColor: "#bb87fa",
                                    border: "none",
                                    fontSize: "17px",
                                }}
                                onMouseDown={(e) => e.stopPropagation()}
                            >
                                {t("CREATE")}
                            </Button>
                        </form>
                    </div>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default ShoppingListDisplay;