function findAndReplaceInSpecifiedForm() {
  const formUrl = 'https://docs.google.com/forms/d/1bSpo0SCFDtaFFSS-MJR2N0MeqSTMqUnpa038ZHxxxxx/edit'; // ← 換成你的表單網址
  const searchText = '演講';
  const replaceText = '活動';

  const form = FormApp.openByUrl(formUrl);

  // 替換標題與說明
  const title = form.getTitle();
  if (title.includes(searchText)) {
    form.setTitle(title.replaceAll(searchText, replaceText));
  }

  const description = form.getDescription();
  if (description.includes(searchText)) {
    form.setDescription(description.replaceAll(searchText, replaceText));
  }

  const items = form.getItems();
  items.forEach(item => {
    // 替換題目標題
    const itemTitle = item.getTitle();
    if (itemTitle.includes(searchText)) {
      item.setTitle(itemTitle.replaceAll(searchText, replaceText));
    }

    const type = item.getType();
    let itemObj;

    switch (type) {
      case FormApp.ItemType.MULTIPLE_CHOICE:
        itemObj = item.asMultipleChoiceItem();
        break;
      case FormApp.ItemType.LIST:
        itemObj = item.asListItem();
        break;
      case FormApp.ItemType.CHECKBOX:
        itemObj = item.asCheckboxItem();
        break;
      default:
        itemObj = null;
    }

    // 如果是支援選項的題型
    if (itemObj) {
      const choices = itemObj.getChoices();
      const newChoices = choices.map(choice => {
        const oldText = choice.getValue();
        const newText = oldText.replaceAll(searchText, replaceText);
        return choice.isCorrectAnswer()
          ? itemObj.createChoice(newText, true)
          : itemObj.createChoice(newText);
      });
      itemObj.setChoices(newChoices);
    }
  });

  Logger.log("✅ 搜尋與取代完成！");
}
