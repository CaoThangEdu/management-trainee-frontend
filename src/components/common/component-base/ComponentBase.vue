<script>
import { mapActions } from 'vuex'
import { options } from '../../../helpers/options'
export default {
  data() {
    return {
    }
  },
  computed: {
  },
  methods:{
    ...mapActions('layout', [ 'setIsShowLoadingData' ]),

    /**
     * Show loading
     */
    showLoading(isShow = true){
      this.setIsShowLoadingData(isShow);
    }, 
    
    /**
     * Add the notification(s)
     * @param {String} type Type of notification: success, info, error, warning
     * @param {String} title Title of notification
     * @param {Array} messages Content of notification
     * @param {Number} timeout Timeout hide notification
     */
    showNotifications(type, title, messages, timeout) {
      if (!Array.isArray(messages)) {
        messages = [messages]
      }
      if (!['success', 'info', 'error', 'warning'].includes(type.toLowerCase())) {
        type = 'info';
      }
      if (!title) {
        title = 'Thông báo';
      }
      if (!timeout || isNaN(timeout)) {
        // default 'success', 'info' is short (10s), 'error', 'warning' is medium (20s)
        timeout = ['success', 'info'].includes(type) ?
             options.timeoutNotificationDefault.short : options.timeoutNotificationDefault.medium;
      }

      for (const msg of messages) {
        this.$notify({
          // (optional)
          // Class that will be assigned to the notification
          type: type,

          // (optional)
          // Width of notification holder, can be %, px string or number.
          // width: window.innerHeight < 350 ? window.innerHeight : 350,

          // (optional)
          // Title (will be wrapped in div.notification-title)
          title: title,

          // Content (will be wrapped in div.notification-content)
          text: msg,

          // (optional)
          // Overrides default/provided duration
          duration: timeout,

          // (optional)
          // Overrides default/provided animation speed
          speed: 500,

          // (optional)
          // Data object that can be used in your template
          data: {}
        })
      }
    }
  }
}
</script>
