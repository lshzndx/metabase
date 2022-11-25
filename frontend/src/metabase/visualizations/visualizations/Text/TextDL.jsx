/* eslint-disable react/prop-types */
import React, { Component } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./TextDL.css";

import _ from "underscore";
import cx from "classnames";
import { t } from "ttag";

import { withInstanceLanguage, siteLocale } from "metabase/lib/i18n";

import { substitute_tags } from "cljs/metabase.shared.parameters.parameters";

const Editor = {
  modules: {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      [{ color: [] }, { background: [] }],
      ["link", "image"],
      ["clean"],
    ],
  },

  formats: [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "link",
    "image",
  ],
};

const toolbarRemoved = { toolbar: false };

/*
 * Quill editor formats
 * See https://quilljs.com/docs/formats/
 */
const getSettingsStyle = settings => ({
  "align-center": settings["text.align_horizontal"] === "center",
  "align-end": settings["text.align_horizontal"] === "right",
  "justify-center": settings["text.align_vertical"] === "middle",
  "justify-end": settings["text.align_vertical"] === "bottom",
});

export default class Text extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: "",
    };
  }

  static uiName = "Text";
  static identifier = "text";
  static iconName = "text";

  static disableSettingsConfig = false;
  static noHeader = true;
  static supportsSeries = false;
  static hidden = true;
  static supportPreviewing = true;

  static minSize = { width: 4, height: 1 };

  static checkRenderable() {
    // text can always be rendered, nothing needed here
  }

  static settings = {
    "card.title": {
      dashboard: false,
      default: t`Text card`,
    },
    "card.description": {
      dashboard: false,
    },
    text: {
      value: "",
      default: "",
    },
    "text.align_vertical": {
      section: t`Display`,
      title: t`Vertical Alignment`,
      widget: "select",
      props: {
        options: [
          { name: t`Top`, value: "top" },
          { name: t`Middle`, value: "middle" },
          { name: t`Bottom`, value: "bottom" },
        ],
      },
      default: "top",
    },
    "text.align_horizontal": {
      section: t`Display`,
      title: t`Horizontal Alignment`,
      widget: "select",
      props: {
        options: [
          { name: t`Left`, value: "left" },
          { name: t`Center`, value: "center" },
          { name: t`Right`, value: "right" },
        ],
      },
      default: "left",
    },
    "dashcard.background": {
      section: t`Display`,
      title: t`Show background`,
      dashboard: true,
      widget: "toggle",
      default: true,
    },
  };

  handleTextChange(text) {
    this.props.onUpdateVisualizationSettings({ text: text });
  }

  preventDragging = e => e.stopPropagation();

  render() {
    const {
      className,
      dashboard,
      dashcard,
      gridSize,
      settings,
      isEditing,
      isPreviewing,
      isSettings,
      parameterValues,
    } = this.props;
    console.log(isSettings);
    const isSingleRow = gridSize && gridSize.height === 1;

    let parametersByTag = {};
    if (dashcard && dashcard.parameter_mappings) {
      parametersByTag = dashcard.parameter_mappings.reduce((acc, mapping) => {
        const tagId = mapping.target[1];
        const parameter = dashboard.parameter.find(
          p => p.id === mapping.parameter_id,
        );
        if (parameter) {
          const parameterValue = parameterValues[parameter.id];
          return {
            ...acc,
            [tagId]: { ...parameter, value: parameterValue },
          };
        } else {
          return acc;
        }
      }, {});
    }

    let content = settings["text"];
    if (!_.isEmpty(parametersByTag)) {
      // Temporarily override language to use site language, so that all viewers of a dashboard see parameter values
      // translated the same way.
      content = withInstanceLanguage(() =>
        substitute_tags(content, parametersByTag, siteLocale()),
      );
    }

    if (isEditing) {
      return (
        <div
          className={cx(className, styles.Text, {
            [styles.padded]: !isPreviewing,
          })}
        >
          {isPreviewing ? (
            <ReactQuill
              theme="snow"
              className={cx(
                "full flex-full flex flex-column text-card-markdown",
                styles["text-card-markdown"],
                getSettingsStyle(settings),
              )}
              modules={toolbarRemoved}
              value={content}
              readOnly={true}
              key="preview-edit"
            />
          ) : (
            <div
              onMouseDown={this.preventDragging}
              className={cx("full flex-full flex flex-column drag-disabled")}
              key="edit-edit-wrap"
            >
              <ReactQuill
                theme="snow"
                className={cx(
                  "full flex-full flex flex-column bg-light bordered",
                  styles["text-card-textarea"],
                )}
                value={content}
                onChange={v => {
                  this.handleTextChange(v);
                }}
                key="edit-edit"
                modules={isSettings ? toolbarRemoved : Editor.modules}
                formats={Editor.formats}
              />
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className={cx(className, styles.Text, {
          // if the card is not showing a background
          // we should adjust the left padding
          // to help align the titles with the wrapper
          pl0: !settings["dashcard.background"],
          "Text--single-row": isSingleRow,
        })}
      >
        <ReactQuill
          theme="snow"
          className={cx(
            "full flex-full flex flex-column text-card-markdown",
            styles["text-card-markdown"],
            getSettingsStyle(settings),
          )}
          modules={toolbarRemoved}
          value={settings.text}
          readOnly={true}
          key="preview"
        />
      </div>
    );
  }
}
