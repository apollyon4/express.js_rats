
/* new project */
(function() {
  var HOST = "https://d13txem1unpe48.cloudfront.net/"

  addEventListener("trix-attachment-add", function(event) {
    if (event.attachment.file) {
      uploadFileAttachment(event.attachment)
    }
  })

  function uploadFileAttachment(attachment) {
    uploadFile(attachment.file, setProgress, setAttributes)

    function setProgress(progress) {
      attachment.setUploadProgress(progress)
    }

    function setAttributes(attributes) {
      attachment.setAttributes(attributes)
    }
  }

  function uploadFile(file, progressCallback, successCallback) {
    var key = createStorageKey(file)
    var formData = createFormData(key, file)
    var xhr = new XMLHttpRequest()

    xhr.open("POST", HOST, true)

    xhr.upload.addEventListener("progress", function(event) {
      var progress = event.loaded / event.total * 100
      progressCallback(progress)
    })

    xhr.addEventListener("load", function(event) {
      if (xhr.status == 204) {
        var attributes = {
          url: HOST + key,
          href: HOST + key + "?content-disposition=attachment"
        }
        successCallback(attributes)
      }
    })

    xhr.send(formData)
  }

  function createStorageKey(file) {
    var date = new Date()
    var day = date.toISOString().slice(0,10)
    var name = date.getTime() + "-" + file.name
    return [ "tmp", day, name ].join("/")
  }

  function createFormData(key, file) {
    var data = new FormData()
    data.append("key", key)
    data.append("Content-Type", file.type)
    data.append("file", file)
    return data
  }
})();
(function() {
  var today = new Date(),
      year = today.getFullYear(),
      $frag = $(document.createDocumentFragment());
  for(var count = year; count >= 2000; count -= 1) {
    $frag.append('<option value='+count+'>'+count+'</option>');
  }
  $('select[name=year]').append($frag);
})();

/* project */
(function () {
  var $incon = $('.innerContent'),
      text = $incon.text();
  $incon.text('');
  $incon.wrapInner(text);

  var date = new Date($('.date').text()),
      d = pad(date.getDate()),
      m = pad(date.getMonth()+1),
      y = date.getFullYear();
  $('.date').text(y+'-'+m+'-'+d);
})();
