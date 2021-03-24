/* eslint-disable no-undef */
const SdkUtils = {
  importSdk(src, onload = () => {}) {
    const sdkScriptTag = document.createElement('script')
    sdkScriptTag.src = src
    sdkScriptTag.defer = true
    sdkScriptTag.async = true
    document.head.appendChild(sdkScriptTag)
    sdkScriptTag.onload = onload
  },
  initFacebookSdk() {
    this.importSdk('https://connect.facebook.net/en_US/sdk.js', () => {
      FB.init({
        appId: process.env.FACEBOOK_APP_ID,
        autoLogAppEvents: true,
        cookie: true,
        xfbml: true,
        version: 'v7.0'
      })
    })
  },
  initGooglePlatform() {
    this.importSdk('https://apis.google.com/js/platform.js', () => {
      gapi.load('auth2', () => {
        gapi.auth2
          .init({
            client_id: process.env.GOOGLE_OAUTH_CLIENT_ID
          })
          .then(
            () => {},
            err => err
          )
      })
    })
  },
  async loginFB() {
    return new Promise((resolve, reject) => {
      FB.getLoginStatus(response => {
        if (response.status !== 'connected') {
          FB.login(
            res => {
              if (res.status === 'connected') {
                resolve(res.authResponse)
              }
            },
            {
              scope: 'public_profile,email'
            }
          )
        } else {
          resolve(response.authResponse)
        }
      })
    })
  },
  shareFB(post) {
    post &&
      FB.ui(
        {
          method: 'share',
          display: 'popup',
          href: `${window.location.origin}/post-detail/${post?._id}`,
          hashtag: '#giadinhtk',
          quote: `Bài viết "${post?.title}" được chia sẻ bởi ${
            post?.createdBy?.firstname
          } tại website ${window.location.origin}. Tham gia cùng mình để chia sẻ kinh nghiệm chăm sóc con cái nhé!`
        },
        // callback
        function (response) {}
      )
  },
  async logoutFB() {
    FB.logout()
  },
  async loginGoogle() {
    const GoogleAuth = gapi.auth2.getAuthInstance()
    if (!GoogleAuth.isSignedIn.get()) {
      await GoogleAuth.signIn()
    }
    return GoogleAuth.currentUser.get().getAuthResponse().id_token
  },
  async logoutGoogle() {
    const auth2 = gapi.auth2.getAuthInstance()
    auth2.signOut()
  }
}
export default SdkUtils
