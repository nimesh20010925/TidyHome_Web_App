import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InventoryService } from "../../../services/InventoryServices.jsx";
import mongoose from "mongoose";
import PropTypes from "prop-types";

const AddInventoryModal = ({ isOpen, toggle }) => {
  const { t } = useTranslation();

  const formik = useFormik({
    initialValues: {
      itemImage: null,
      itemName: "",
      categoryId: "",
      quantity: "",
      price: "",
      itemType: "",
      supplierId: "",
      lowStockLevel: "",
      manufacturedDate: "",
      brandName: "",
    },
    validationSchema: Yup.object({
      itemName: Yup.string().required(t("PRODUCT_NAME_REQUIRED")),
      quantity: Yup.number().positive().required(t("QUANTITY_REQUIRED")),
      price: Yup.number().positive().required(t("PRICE_REQUIRED")),
      itemType: Yup.string().required(t("ITEM_TYPE_REQUIRED")),
      lowStockLevel: Yup.number().positive().required(t("LOW_LEVEL_REQUIRED")),
      manufacturedDate: Yup.date().nullable(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      // Ensure manufacturedDate is a Date object
      const transformedValues = {
        ...values,
        categoryId: values.categoryId
          ? mongoose.Types.ObjectId(values.categoryId)
          : null,
        supplierId: values.supplierId
          ? mongoose.Types.ObjectId(values.supplierId)
          : null,
        manufacturedDate: values.manufacturedDate
          ? new Date(values.manufacturedDate)
          : null,
      };

      try {
        await InventoryService.createInventoryItem(transformedValues);
        alert(t("INVENTORY_ITEM_ADDED_SUCCESS"));
        resetForm();
        toggle();
      } catch (error) {
        console.error("Error adding inventory item:", error);
        alert(t("INVENTORY_ITEM_ADD_FAILED"));
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleToggle = () => {
    toggle();
    formik.resetForm();
  };

  const closeBtn = (
    <button className="close-btn" onClick={handleToggle} type="button">
      <img
        width="20"
        height="20"
        src="https://img.icons8.com/ios/20/cancel.png"
        alt="cancel"
      />
    </button>
  );

  return (
    <Modal
      className="add-inventory-modal"
      isOpen={isOpen}
      toggle={toggle}
      centered
    >
      <ModalHeader
        toggle={toggle}
        close={closeBtn}
        className="border-0 poppins-medium mx-4 mt-2 fw-bold"
      >
        {t("ADD_INVENTORY_ITEM_FORM")}
      </ModalHeader>

      <ModalBody className="add-inventory-modal-body">
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="custom-inventory-form-group">
            <Form.Control
              className="custom-inventory-form-input"
              type="file"
              name="itemImage"
              onChange={(e) =>
                formik.setFieldValue("itemImage", e.target.files[0])
              }
            />
            <Form.Label>{t("ITEM_IMAGE")}</Form.Label>
          </Form.Group>

          <Form.Group className="custom-inventory-form-group">
            <Form.Control
              className="custom-inventory-form-input"
              type="text"
              name="itemName"
              placeholder={t("ENTER_PRODUCT_NAME")}
              onChange={formik.handleChange}
              value={formik.values.itemName}
            />
            {formik.errors.itemName && formik.touched.itemName && (
              <div className="text-danger">{formik.errors.itemName}</div>
            )}
            <Form.Label>
              {t("PRODUCT_NAME")} <span className="required">*</span>
            </Form.Label>
          </Form.Group>

          <Form.Group className="custom-inventory-form-group">
            <Form.Label>
              {t("CATEGORY")} <span className="required">*</span>
            </Form.Label>
            <Form.Select
              className="custom-inventory-form-input"
              name="categoryId"
              onChange={formik.handleChange}
              value={formik.values.categoryId}
            >
              <option value="" disabled>
                {t("SELECT_CATEGORY")}
              </option>
              <option value="Category 1">Category 1</option>
              <option value="Category 2">Category 2</option>
            </Form.Select>
            {/* {formik.errors.categoryId && formik.touched.categoryId && (
              <div className="text-danger">{formik.errors.categoryId}</div>
            )} */}
          </Form.Group>

          <Form.Group className="custom-inventory-form-group">
            <Form.Control
              className="custom-inventory-form-input"
              type="number"
              name="quantity"
              placeholder={t("ENTER_QUANTITY")}
              onChange={formik.handleChange}
              value={formik.values.quantity}
            />
            {formik.errors.quantity && formik.touched.quantity && (
              <div className="text-danger">{formik.errors.quantity}</div>
            )}
            <Form.Label>
              {t("QUANTITY")} <span className="required">*</span>
            </Form.Label>
          </Form.Group>

          <Form.Group className="custom-inventory-form-group">
            <Form.Control
              className="custom-inventory-form-input"
              type="text"
              name="price"
              placeholder={t("ENTER_PRICE")}
              onChange={formik.handleChange}
              value={formik.values.price}
            />
            {formik.errors.price && formik.touched.price && (
              <div className="text-danger">{formik.errors.price}</div>
            )}
            <Form.Label>
              {t("PRICE")} <span className="required">*</span>
            </Form.Label>
          </Form.Group>

          <Form.Group className="custom-inventory-form-group">
            <Form.Label>
              {t("ITEM_TYPE")} <span className="required">*</span>
            </Form.Label>
            <Form.Select
              className="custom-inventory-form-input"
              name="itemType"
              onChange={formik.handleChange}
              value={formik.values.itemType}
            >
              <option value="" disabled>
                {t("SELECT_ITEM_TYPE")}
              </option>
              <option value="Unit">{t("UNIT")}</option>
              <option value="Kg">{t("KG")}</option>
              <option value="Litre">{t("LITRE")}</option>
              <option value="Metre">{t("METRE")}</option>
            </Form.Select>
            {formik.errors.itemType && formik.touched.itemType && (
              <div className="text-danger">{formik.errors.itemType}</div>
            )}
          </Form.Group>

          <Form.Group className="custom-inventory-form-group">
            <Form.Label>{t("SUPPLIER")}</Form.Label>
            <Form.Select
              className="custom-inventory-form-input"
              defaultValue=""
            >
              <option value="" disabled>
                {t("SELECT_SUPPLIER")}
              </option>
              <option value="Supplier 1">Supplier 1</option>
              <option value="Supplier 2">Supplier 2</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="custom-inventory-form-group">
            <Form.Control
              className="custom-inventory-form-input"
              type="number"
              name="lowStockLevel"
              placeholder={t("ENTER_LOW_STOCK_LEVEL")}
              onChange={formik.handleChange}
              value={formik.values.lowStockLevel}
            />
            {formik.errors.lowStockLevel && formik.touched.lowStockLevel && (
              <div className="text-danger">{formik.errors.lowStockLevel}</div>
            )}
            <Form.Label>
              {t("LOW_LEVEL")}
              {formik.values.itemType === "Unit"
                ? t("UNIT")
                : formik.values.itemType === "Kg"
                ? t("KG")
                : formik.values.itemType === "Litre"
                ? t("LITRE")
                : formik.values.itemType === "Metre"
                ? t("METRE")
                : ""}
              <span className="required">*</span>
            </Form.Label>
          </Form.Group>

          <Form.Group className="custom-inventory-form-group">
            <Form.Control
              className="custom-inventory-form-input-date"
              type="date"
              name="manufacturedDate"
              value={
                formik.values.manufacturedDate
                  ? new Date(formik.values.manufacturedDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                formik.setFieldValue("manufacturedDate", e.target.value)
              }
              onBlur={formik.handleBlur}
            />
            <Form.Label>{t("MANUFACTURED_DATE")}</Form.Label>
            {formik.touched.manufacturedDate &&
              formik.errors.manufacturedDate && (
                <div className="error">{formik.errors.manufacturedDate}</div>
              )}
          </Form.Group>

          <Form.Group className="custom-inventory-form-group">
            <Form.Control
              className="custom-inventory-form-input"
              type="text"
              name="brandName"
              placeholder={t("ENTER_BRAND_NAME")}
              onChange={formik.handleChange}
              value={formik.values.brandName}
            />
            <Form.Label>{t("BRAND_NAME")}</Form.Label>
          </Form.Group>

          <Button
            type="submit"
            className="w-100 pt-2 pb-2 fw-bold"
            disabled={formik.isSubmitting}
            style={{
              backgroundColor: "#bb87fa",
              border: "none",
              fontSize: "17px",
            }}
          >
            {formik.isSubmitting ? t("ADDING_ITEM") : t("ADD_ITEM")}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

AddInventoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
};

export default AddInventoryModal;
