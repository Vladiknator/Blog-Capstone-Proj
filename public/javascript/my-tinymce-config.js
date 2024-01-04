// eslint-disable-next-line no-undef
tinymce.init({
  selector: 'textarea#my-expressjs-tinymce-app',
  height: 500,
  menubar: false,
  setup(editor) {
    editor.on('change', () => {
      // eslint-disable-next-line no-undef
      tinymce.triggerSave();
    });
  },
  plugins: [
    'advlist',
    'autolink',
    'link',
    'image',
    'lists',
    'charmap',
    'preview',
    'anchor',
    'pagebreak',
    'searchreplace',
    'wordcount',
    'visualblocks',
    'visualchars',
    'code',
    'fullscreen',
    'insertdatetime',
    'media',
    'table',
    'emoticons',
    'template',
    'help',
  ],
  toolbar:
    'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image | print preview media fullscreen | ' +
    'forecolor backcolor emoticons | help',
});
