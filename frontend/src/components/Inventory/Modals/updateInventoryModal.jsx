import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InventoryService } from "../../../services/InventoryServices.jsx";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";

const UpdateInventoryModal = ({ isOpen, toggle, selectedItem }) => {
  const [updatedItem, setUpdatedItem] = useState(selectedItem);
  const { t } = useTranslation();

  useEffect(() => {
    console.log(selectedItem);
    setUpdatedItem(selectedItem);
  });

  const today = new Date();
  const twoYearsAgo = new Date(today);
  twoYearsAgo.setFullYear(today.getFullYear() - 2);

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
      quantity: Yup.number()
        .positive(t("QUANTITY_MUST_BE_POSITIVE"))
        .min(0.01, t("QUANTITY_CANNOT_BE_ZERO"))
        .required(t("QUANTITY_REQUIRED")),
      price: Yup.number()
        .positive(t("PRICE_MUST_BE_POSITIVE"))
        .min(1, t("PRICE_CANNOT_BE_ZERO"))
        .required(t("PRICE_REQUIRED")),
      itemType: Yup.string().required(t("ITEM_TYPE_REQUIRED")),
      lowStockLevel: Yup.number()
        .positive(t("LOW_LEVEL_MUST_BE_POSITIVE"))
        .min(0.01, t("LOW_LEVEL_CANNOT_BE_ZERO"))
        .required(t("LOW_LEVEL_REQUIRED")),
      manufacturedDate: Yup.date().nullable(),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      const transformedValues = {
        ...values,
        manufacturedDate: values.manufacturedDate
          ? new Date(values.manufacturedDate)
          : null,
      };

      try {
        await InventoryService.createInventoryItem(transformedValues);
        toast.success(t("INVENTORY_ITEM_ADDED_SUCCESS"), {
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        });
        resetForm();
        toggle();
      } catch (error) {
        console.error("Error adding inventory item:", error);
        toast.error(t("INVENTORY_ITEM_ADD_FAILED"), {
          style: {
            background: "#f44336",
            color: "#fff",
          },
        });
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
        {t("UPDATE_INVENTORY_ITEM_FORM")}
      </ModalHeader>

      <ModalBody className="add-inventory-modal-body">
        <Form onSubmit={formik.handleSubmit}>
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
            <Form.Control
              className="custom-inventory-form-input"
              type="number"
              name="quantity"
              placeholder={t("ENTER_QUANTITY")}
              onChange={(e) => {
                // Prevent negative values during onChange
                const value = e.target.value;
                if (parseFloat(value) < 0) {
                  return;
                }
                formik.handleChange(e);
              }}
              value={formik.values.quantity}
              onKeyDown={(e) => {
                // Block ArrowDown and ArrowUp key from changing the value to negative
                if (e.key === "ArrowDown" && formik.values.quantity <= 0) {
                  e.preventDefault();
                }

                // Block the `-` sign from being typed
                if (e.key === "-" || e.key === "Minus") {
                  e.preventDefault();
                }
              }}
              inputMode="numeric" // This helps with mobile input behavior, but won't allow '-' for number input
            />
            {formik.errors.quantity && formik.touched.quantity && (
              <div className="text-danger">{formik.errors.quantity}</div>
            )}
            <Form.Label>
              {t("QUANTITY")}{" "}
              {formik.values.itemType === "Unit" ||
              formik.values.itemType === "Kg" ||
              formik.values.itemType === "Litre" ||
              formik.values.itemType === "Metre"
                ? `(${
                    formik.values.itemType === "Unit"
                      ? t("UNIT")
                      : formik.values.itemType === "Kg"
                      ? t("KG")
                      : formik.values.itemType === "Litre"
                      ? t("LITRE")
                      : formik.values.itemType === "Metre"
                      ? t("METRE")
                      : ""
                  })`
                : ""}
              <span className="required">*</span>
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
              onInput={(e) => {
                e.target.value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*?)\..*/g, "$1");
              }}
            />
            {formik.errors.price && formik.touched.price && (
              <div className="text-danger">{formik.errors.price}</div>
            )}
            <Form.Label>
              {t("PRICE")}{" "}
              {formik.values.itemType === "Unit" ||
              formik.values.itemType === "Kg" ||
              formik.values.itemType === "Litre" ||
              formik.values.itemType === "Metre"
                ? `(${
                    formik.values.itemType === "Unit"
                      ? t("PER_UNIT")
                      : formik.values.itemType === "Kg"
                      ? t("PER_KG")
                      : formik.values.itemType === "Litre"
                      ? t("PER_LITRE")
                      : formik.values.itemType === "Metre"
                      ? t("PER_METRE")
                      : ""
                  })`
                : ""}
              <span className="required">*</span>
            </Form.Label>
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
              onChange={(e) => {
                const value = e.target.value;
                if (parseFloat(value) < 0) {
                  return;
                }
                formik.handleChange(e);
              }}
              value={formik.values.lowStockLevel}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown" && formik.values.lowStockLevel <= 0) {
                  e.preventDefault();
                }

                if (e.key === "-" || e.key === "Minus") {
                  e.preventDefault();
                }
              }}
              inputMode="numeric"
            />
            {formik.errors.lowStockLevel && formik.touched.lowStockLevel && (
              <div className="text-danger">{formik.errors.lowStockLevel}</div>
            )}
            <Form.Label>
              {t("LOW_LEVEL")}{" "}
              {formik.values.itemType === "Unit" ||
              formik.values.itemType === "Kg" ||
              formik.values.itemType === "Litre" ||
              formik.values.itemType === "Metre"
                ? `(${
                    formik.values.itemType === "Unit"
                      ? t("UNIT")
                      : formik.values.itemType === "Kg"
                      ? t("KG")
                      : formik.values.itemType === "Litre"
                      ? t("LITRE")
                      : formik.values.itemType === "Metre"
                      ? t("METRE")
                      : ""
                  })`
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
              onBlur={(e) => {
                const newDate = new Date(e.target.value);

                // Check if the entered date is valid, not a future date, and within the past 2 years
                if (newDate > today || newDate < twoYearsAgo) {
                  toast.error(t("INVALID_DATE"), {
                    style: {
                      background: "#B32113",
                      color: "#fff",
                    },
                  });
                  formik.setFieldValue("manufacturedDate", "");
                }
              }}
              min={twoYearsAgo.toISOString().split("T")[0]}
              max={today.toISOString().split("T")[0]}
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
            className="w-100 pt-2 pb-2 fw-bold d-flex align-items-center justify-content-center gap-2"
            disabled={formik.isSubmitting}
            style={{
              backgroundColor: "#bb87fa",
              border: "none",
              fontSize: "17px",
            }}
          >
            {formik.isSubmitting && (
              <div
                className="spinner-border text-light"
                role="status"
                style={{ width: "1rem", height: "1rem", borderWidth: "2px" }}
              />
            )}
            {formik.isSubmitting ? t("UPDATING_ITEM") : t("UPDATE_ITEM")}
          </Button>
        </Form>
      </ModalBody>
    </Modal>
  );
};

UpdateInventoryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selectedItem: PropTypes.any.isRequired,
};

export default UpdateInventoryModal;
