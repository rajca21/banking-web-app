import * as xlsx from 'xlsx';

const formatUserTransactions = (data) => {
  console.log(data);

  let formatted = data.map((row, idx) => {
    return {
      no: idx + 1,
      id: row._id,
      sender: row.accountSender.number,
      receiver: row.accountReceiver.number,
      sentAmount: row.receiverAmount,
      date: new Date(row.createdAt).toLocaleDateString(),
      description: row.description,
    };
  });
  return formatted;
};

export const exportToExcel = (data, filename) => {
  filename = new Date().getTime() + '-records';
  const worksheet = xlsx.utils.json_to_sheet(formatUserTransactions(data));
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  xlsx.writeFile(workbook, `${filename}.xlsx`);
};
