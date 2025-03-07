import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { alertActions } from "store/slices/alertSlice";
import { HttpMethod } from "utils/httpMethods";
import useAPI from "../../hooks/useAPI";
import { ICourseResponse as ICourse } from "../../utils/interfaces";
import { useTranslation } from "react-i18next";

/**
 * @author Atharva Thorve, on December, 2023
 * @author Mrityunjay Joshi on December, 2023
 */

// DeleteCourse Component: Modal for deleting a course

interface IDeleteCourse {
  courseData: ICourse;
  onClose: () => void;
}

const DeleteCourse: React.FC<IDeleteCourse> = ({ courseData, onClose }) => {
  const { t } = useTranslation(); // Initialize useTranslation hook

  // State and hook declarations
  const { data: deletedCourse, error: courseError, sendRequest: DeleteCourse } = useAPI();
  const [show, setShow] = useState<boolean>(true);
  const dispatch = useDispatch();

  // Delete course
  const deleteHandler = () =>
    DeleteCourse({ url: `/courses/${courseData.id}`, method: HttpMethod.DELETE });

  // Show error if any
  useEffect(() => {
    if (courseError) dispatch(alertActions.showAlert({ variant: "danger", message: courseError }));
  }, [courseError, dispatch]);

  // Close modal if course is deleted
  useEffect(() => {
    if (deletedCourse?.status && deletedCourse?.status >= 200 && deletedCourse?.status < 300) {
      setShow(false);
      dispatch(
        alertActions.showAlert({
          variant: "success",
          message: t('courses.delete.success_message', { courseName: courseData.name }),
        })
      );
      onClose();
    }
  }, [deletedCourse?.status, dispatch, onClose, courseData.name, t]);

  // Function to close the modal
  const closeHandler = () => {
    setShow(false);
    onClose();
  };

  // Render the DeleteCourse modal
  return (
    <Modal show={show} onHide={closeHandler}>
      <Modal.Header closeButton>
        <Modal.Title>{t('courses.delete.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          {t('courses.delete.confirm_message')} <b>{courseData.name}?</b>
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={closeHandler}>
          {t('courses.delete.cancel')}
        </Button>
        <Button variant="outline-danger" onClick={deleteHandler}>
          {t('courses.delete.delete')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteCourse;