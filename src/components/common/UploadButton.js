import React, { useEffect, useState, useMemo } from "reactn";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import ImageEditor from "@uppy/image-editor";
import { DashboardModal } from "@uppy/react";

import { makeRequest } from "../../hooks/useApi";

import "@uppy/core/dist/style.css";
import "@uppy/dashboard/dist/style.css";
import "@uppy/image-editor/dist/style.css";

const UploadButton = ({ btnLabel = "Add Image", className, onUpload }) => {
  const [open, setOpen] = useState(false);

  const uppy = useMemo(() => {
    return new Uppy({
      id: "uppy",
      restrictions: {
        maxFileSize: 10000000, //10MB
        allowedFileTypes: ["image/*"],
        maxNumberOfFiles: 1,
      },
      autoProceed: false,
      debug: true,
    })
      .use(AwsS3, {
        getUploadParameters(file) {
          return makeRequest("post", "/uploads/presign-upload", {
            fileName: file.name,
            contentType: file.type,
          }).then((res) => {
            return { method: "PUT", url: res.url, fields: [] };
          });
        },
      })
      .use(ImageEditor, {
        id: "ImageEditor",
        quality: 0.8,
        cropperOptions: {
          viewMode: 1,
          background: false,
          autoCropArea: 1,
          responsive: true,
        },
      })
      .on("upload-success", (file, response) => {
        onUpload(response.uploadURL);
        uppy.reset();
        setOpen(false);
      });
  }, []);

  useEffect(() => {
    return () => {
      uppy.close();
    };
  }, []);

  return (
    <>
      <Button
        variant="link"
        onClick={() => setOpen(true)}
        className={className || ""}
      >
        {btnLabel}
      </Button>
      <DashboardModal
        uppy={uppy}
        closeModalOnClickOutside={true}
        autoOpenFileEditor={true}
        open={open}
        onRequestClose={() => setOpen(false)}
        plugins={["Instagram", "ImageEditor"]}
        metaFields={[{ id: "name", name: "Name", placeholder: "File Name" }]}
      />
    </>
  );
};

UploadButton.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
};

export default UploadButton;
