<template>
  <div class="input-group-upload-image">
    <input
      type="file"
      class="d-none"
      ref="inputImage"
      id="input-choose-image"
      aria-describedby="input-choose-image"
      :accept="strExtensionAccepted"
      @change="chooseFile"
    />
    <div class="input-group">
      <input
        id="input-url-image"
        type="text"
        class="form-control"
        v-model="path"
        :readonly="readonly"
        @input="onInput"
        autocomplete="off"
      />
      <div class="input-group-append">
        <label
          for="input-choose-image"
          class="btn"
          :class="buttonClass"
        >{{$t('general.choose-image')}}</label>
      </div>
    </div>
    <div class="image-review">
        <img v-show="review && path" :src="path" :alt="path">
    </div>
  </div>
</template>


<script>
import ComponentBase from "../../../component-base/ComponentBase";

import FileUploadApi from "../../../../../api/file-upload/fileUploadApi";

import { options } from "../../../../../helpers/options";
import fileHelper from "../../../../../helpers/utils/fileHelper";
export default {
  name: "InputGroupUploadImage",
  extends: ComponentBase,
  props: {
    data: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    review: {
      type: Boolean,
      default: false,
    },
    buttonType: {
      type: String,
      default: "primary",
    },
    extension: {
      type: Array,
      default: null,
    },
  },
  data() {
    return {
      imagePath: null,
    };
  },
  computed: {
    path: {
      set(value) {
        this.imagePath = value;
      },
      get() {
        return this.data;
      },
    },
    // get button class of button Choose file
    buttonClass() {
      switch (this.buttonType) {
        case "primary":
          return "btn-primary";
        case "success":
          return "btn-success";
        case "danger":
          return "btn-danger";
        case "warning":
          return "btn-warning";
        case "info":
          return "btn-info";
        default:
          return "btn-primary";
      }
    },
    // Array Extension Accepted
    arrExtensionAccepted() {
      if (this.extension) {
        return this.extension;
      }
      return options.configUploadDefault.extensionImg;
    },
    // String Extension Accepted
    strExtensionAccepted() {
      return "." + this.arrExtensionAccepted.join(",.");
    },
  },
  methods: {
    // Xử lý khi upload file
    async chooseFile(event) {
      // K chọn file hoặc cancel
      let target = event.target || event.srcElement;
      if (target.value.length == 0) {
        return;
      }

      const file = this.$refs.inputImage.files[0];
      let maxSize = options.configUploadDefault.maxSize;
      // TODO: Check file valid
      // 0: file is null, -1: size to large, -2: extension of file is invalid , 1: File is OK
      var checkFile = fileHelper.checkFile(
        file,
        this.arrExtensionAccepted,
        maxSize
      );
      this.$refs.inputImage.value = null;
      switch (checkFile) {
        case 0:
          this.showNotifications(
            "error",
            this.$t("notification.title-default"),
            this.$i18n.t("notification.upload-image-error-not-choose")
          );
          break;
        case -1:
          this.showNotifications(
            "error",
            this.$t("notification.title-default"),
            this.$i18n.t("notification.upload-image-error-size", {
              size: maxSize / 1024 / 1024 + "MB",
            })
          );
          break;
        case -2:
          this.showNotifications(
            "error",
            this.$t("notification.title-default"),
            this.$i18n.t("notification.upload-image-error-extension", {
              extension: this.strExtensionAccepted.replace(/./g, " *.").trim(),
            })
          );
          break;
      }

      // File valid => Upload file
      if (checkFile === 1) {
        let formData = new FormData();
        formData.append("files", file);
        let api = new FileUploadApi();

        this.showLoading();
        let result = await api.uploadFiles(formData);
        this.showLoading(false);
        if (!result.isOK || result.data.length === 0) {
          this.showNotifications(
            "error",
            this.$t("notification.title-default"),
            this.$i18n.t("notification.upload-file-error")
          );
        } else {
          let imageInfo = {
            path: result.data[0].fullPath,
            fileName: result.data[0].fileName,
            extension: fileHelper.getExtensionFile(result.data[0].fileName),
          };
          this.path = imageInfo.path;
          // this.$forceUpdate();
          this.$emit("upload", imageInfo);
        }
      }
    },

    onInput() {
      let fileName = fileHelper.getFileName(this.imagePath);
      // this.$forceUpdate();
      this.$emit("upload", 
          {
            path: this.imagePath,
            fileName: fileName,
            extension: fileHelper.getExtensionFile(fileName).toLowerCase(),
          });
    }

  },
};
</script>

<style lang="scss">
@import "./InputGroupUploadImage.scss";
</style>