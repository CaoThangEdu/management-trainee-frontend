<template>
  <div class="input-group-upload-file">
    <input
      type="file"
      class="d-none"
      ref="inputFiles"
      id="input-choose-file"
      aria-describedby="input-choose-file"
      multiple="multiple"
      :accept="strExtensionAccepted"
      @change="chooseFile"
    />
    <div class="d-flex">
      <div class="button-box">
        <label
          for="input-choose-file"
          class="btn"
          :class="buttonClass"
        >Chọn tập tin</label>
      </div>
      <div class="files-box">
        <span class="item-file" v-for="(item, index) in listFiles" :key="index" :title="item.fileName">
          <a
            class="link-file"
            :href="item.path"
            target="_blank"
          >
            <i class="fa" :class="getExtensionIcon(item.extension)" aria-hidden="true"></i>
          </a>
          <i class="fa fa-times" @click.stop="removeFile(index)"></i>
        </span>
      </div>
    </div>
  </div>
</template>


<script>
import ComponentBase from "../../../component-base/ComponentBase";
import FileUploadApi from "../../../../../api/file-upload/fileUploadApi";
import AppConfig from '../../../../../../src/app.config.json';
import { options } from "../../../../../helpers/options";
import fileHelper from "../../../../../helpers/utils/fileHelper";

export default {
  name: "InputGroupUploadFiles",
  extends: ComponentBase,
  props: {
    data: {
      type: Array,
      default: null,
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
      listFiles: null,
    };
  },
  computed: {
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
      return options.configUploadDefault.extensionFile;
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

      const files = this.$refs.inputFiles.files;
      let maxSize = options.configUploadDefault.maxSize;
      let errors = [];
      // TODO: Check file valid
      for (const file of files) {
        // 0: file is null, -1: size to large, -2: extension of file is invalid , 1: File is OK
        var checkFile = fileHelper.checkFile(
          file,
          this.arrExtensionAccepted,
          maxSize
        );
        switch (checkFile) {
          case 0:
            errors.push(`${AppConfig.notification.upload_file_error_not_choose}`);
            break;
          case -1:
            errors.push(`${AppConfig.notification.upload_file_error_size}` + 
            {size: maxSize / 1024 / 1024 + "MB",} + `<br>(<b>${file.name}</b>)`);
            break;
          case -2:
            errors.push(`${AppConfig.notification.upload_file_error_extension}` + 
            {extension: this.strExtensionAccepted.replace(/./g, " *.").trim(),} + `<br>(<b>${file.name}</b>)`);
            break;
        }
      }

      // Validate 
      if (errors && errors.length > 0) {
          this.showNotifications(
            "error",
            `${AppConfig.notification.title_default}`,
            errors
          );
          return;
      }

      let formData = new FormData();
      for (const file of files) {
        formData.append("files", file);
      }
      this.$refs.inputFiles.value = null;

      let api = new FileUploadApi();

      this.showLoading();
      let result = await api.uploadFiles(formData);
      this.showLoading(false);
      if (!result.isOK || result.data.length === 0) {
        this.showNotifications(
          "error",
          `${AppConfig.notification.title_default}`,
          `${AppConfig.notification.upload_file_error}`
        );
      } else {
        for (const item of result.data) {
          this.listFiles.push( {
            path: item.fullPath,
            fileName: item.fileName,
            extension: fileHelper.getExtensionFile(item.fileName).toLowerCase(),
          });
        }
        this.$emit("upload", this.listFiles);
      }
    },

    removeFile(index) {
      this.listFiles.splice(index, 1);
        this.$emit("upload", this.listFiles);
    },

    getExtensionIcon(extension) {
      return fileHelper.getExtensionIcon(extension);
    },
  },
  watch: {
    data: {
      handler: function () {
        if (this.data) {
          this.listFiles = [];
          for (const path of this.data) {
            let fileName = fileHelper.getFileName(path);
            if (!fileName) {
              continue;
            }
            this.listFiles.push({
              path: path,
              fileName: fileName,
              extension: fileHelper.getExtensionFile(fileName).toLowerCase(),
            });
          }
        }
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
@import "./InputGroupUploadFiles.scss";
</style>