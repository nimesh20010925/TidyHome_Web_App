import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import userAvatar from "../../../assets/navBar/dummy-user.png";
import AddHomeMembers from "../AddHomeMembers.jsx"; // Assuming this is the modal component
import { Button } from "react-bootstrap"; // If you're using react-bootstrap for buttons
import { FaEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa";
import { toast } from "react-hot-toast";
import DeleteConformationbox from "../../../common/DeleteConformationbox.jsx";
const HomeMembersTable = () => {
    const [members, setMembers] = useState([]);
    const [editingMember, setEditingMember] = useState(null);
    const [updatedName, setUpdatedName] = useState("");
    const [updatedEmail, setUpdatedEmail] = useState("");
    const [updatedPhone, setUpdatedPhone] = useState("");
    const [updatedAddress, setUpdatedAddress] = useState("");
    const [userRole, setUserRole] = useState(""); // Initialize userRole state
    const [addHomeMembersModal, setAddHomeMembersModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedMember, setSelectedMember] = useState(null);
    const { t } = useTranslation();
    const addHomeMembersToggle = () => setAddHomeMembersModal(!addHomeMembersModal); // Toggle modal visibility

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUserRole(parsedUser.role);
        }
    }, []); // Effect to get user role from local storage

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get("http://localhost:3500/api/auth/home/members", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembers(response.data.members);
        } catch (error) {
            console.error("Error fetching members", error);
            toast.error("Error fetching members")
        }
    };

    const confirmDelete = (member) => {
        setSelectedMember(member);
        setDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!selectedMember) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:3500/api/auth/home/members/${selectedMember._id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setMembers(members.filter((member) => member._id !== selectedMember._id));
            setDeleteModal(false);
            toast.success("Member deleted successfully!");
        } catch (error) {
            console.error("Error deleting member", error);
            toast.error("Error deleting member");
        }
    };

    const handleEdit = (member) => {
        setEditingMember(member._id);
        setUpdatedName(member.name);
        setUpdatedEmail(member.email);
        setUpdatedPhone(member.phone);
        setUpdatedAddress(member.address);
    };

    const handleUpdate = async (memberID) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `http://localhost:3500/api/auth/home/members/${memberID}`,
                { name: updatedName, email: updatedEmail, phone: updatedPhone, address: updatedAddress },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setMembers(
                members.map((member) =>
                    member._id === memberID ? { ...member, name: updatedName, email: updatedEmail, phone: updatedPhone, address: updatedAddress } : member
                )
            );
            setEditingMember(null);
        } catch (error) {
            console.error("Error updating member", error);
            toast.error("Error updating member")
        }
    };

    return (
        <div className="home-members-table-container">
            <div className="home-member-table-header">
                <h2 className="home-member-table-title">{t("HOMEMEMBERLIST")}</h2>
                {userRole === "homeOwner" && (
                    <Button variant="primary" size="sm" className="me-3" onClick={addHomeMembersToggle}>
                        {t("ADDHOMEMEMBER")}
                    </Button>
                )}
            </div>

            <table className="home-members-table">
                <thead>
                    <tr>
                        <th>User Image</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Contact Number</th>
                        <th>Address</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member._id}>
                            <td>
                                <img
                                    src={userAvatar}
                                    alt="User"
                                    className="home-member-user-avatar"
                                />
                            </td>
                            <td>
                                {editingMember === member._id ? (
                                    <input
                                        type="text"
                                        className="home-member-edit-input"
                                        value={updatedName}
                                        onChange={(e) => setUpdatedName(e.target.value)}
                                    />
                                ) : (
                                    member.name
                                )}
                            </td>
                            <td>
                                {editingMember === member._id ? (
                                    <input
                                        type="email"
                                        className="home-member-edit-input"
                                        value={updatedEmail}
                                        onChange={(e) => setUpdatedEmail(e.target.value)}
                                    />
                                ) : (
                                    member.email
                                )}
                            </td>
                            <td>
                                {editingMember === member._id ? (
                                    <input
                                        type="text"
                                        className="home-member-edit-input"
                                        value={updatedPhone}
                                        onChange={(e) => setUpdatedPhone(e.target.value)}
                                    />
                                ) : (
                                    member.phone
                                )}
                            </td>
                            <td>
                                {editingMember === member._id ? (
                                    <input
                                        type="text"
                                        className="home-member-edit-input"
                                        value={updatedAddress}
                                        onChange={(e) => setUpdatedAddress(e.target.value)}
                                    />
                                ) : (
                                    member.address
                                )}
                            </td>
                            <td>
                                <div className="home-member-action-icons">
                                    <button className="home-member-view-btn"><FaRegEye size={25}/></button>
                                    {editingMember === member._id ? (
                                        <button className="home-member-save-btn" onClick={() => handleUpdate(member._id)}>
                                            <IoIosSave size={25}/>
                                        </button>
                                    ) : (
                                        <button className="home-member-edit-btn" onClick={() => handleEdit(member)}>
                                            <FaEdit size={25}/>
                                        </button>
                                    )}
                                    <button className="home-member-delete-btn" onClick={() => confirmDelete(member)}>
                                        <RiDeleteBin6Line size={25}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <AddHomeMembers isOpen={addHomeMembersModal} toggle={addHomeMembersToggle} />
            <DeleteConformationbox isOpen={deleteModal} toggle={() => setDeleteModal(false)} handleDelete={handleDelete} selectedMember={selectedMember} />
        </div>
    );
};

export default HomeMembersTable;
