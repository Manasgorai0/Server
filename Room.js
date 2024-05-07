const fs = require('fs');

class Room {
  constructor() {
    this.data = [];
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      const fileData = fs.readFileSync('Data/room.json', 'utf8');
      this.data = JSON.parse(fileData);
    } catch (error) {
      console.error('Error loading from file:', error);
      this.data = [];
    }
  }

  saveToFile() {
    try {
      fs.writeFileSync('Data/room.json', JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving to file:', error);
    }
  }

  getNextNo() {
    if (this.data.length === 0) {
      return 1; // Start from 1 if the database is empty.
    }
    const maxNo = Math.max(...this.data.map(entry => entry.No));
    return maxNo + 1; // Return the next No.
  }

  add(Id, Title, Dates, Time, Maps, Team, Prospective, Prize, PrizePerKill, EntryFee, Player, JoinPlayer) {
    const No = this.getNextNo(); // Automatically generate the next No.
    const entry = { No, Id, Title, Dates, Time, Maps, Team, Prospective, Prize, PrizePerKill, EntryFee, Player, JoinPlayer };
    this.data.push(entry);
    this.saveToFile();
    return true; // Entry added successfully.
  }

  addByObj(obj) {
    const No = this.getNextNo(); // Automatically generate the next No.
    obj.No = No;
    this.data.push(obj);
    this.saveToFile();
    return true; 
    // The console.log below will never be reached because it comes after a return statement.
    // console.log("Entry added successfully.");
  }

  delete(key, value) {
    const index = this.data.findIndex(entry => entry[key] === value);
    if (index !== -1) {
      this.data.splice(index, 1);
      this.reassignNos(); // Reassign Nos to maintain sequence.
      this.saveToFile();
      return true; // Entry deleted successfully.
    } else {
      return false; // Entry not found.
    }
  }

  update(No, Title, Dates, Time, Maps, Team, Prospective, Prize, PrizePerKill, EntryFee, Player, JoinPlayer) {
    const entry = this.data.find(entry => entry.No === No);
    if (entry) {
      entry.Title = Title;
      entry.Dates = Dates;
      entry.Time = Time;
      entry.Maps = Maps;
      entry.Team = Team;
      entry.Perspective = Perspective;
      entry.Prize = Prize;
      entry.PrizePerKill = PrizePerKill;
      entry.EntryFee = EntryFee;
      entry.Player = Player;
      entry.JoinPlayer = JoinPlayer;
      this.saveToFile();
      return true; // Entry updated successfully.
    } else {
      return false; // Entry not found.
    }
  }

  reassignNos() {
    this.data.forEach((entry, index) => {
      entry.No = index + 1; // Reassign No based on the index.
    });
  }

  display(option) {
    let displayData;
    switch (option) {
      case 'No':
        displayData = this.data.map(entry => entry.No);
        break;
      case 'Title':
        displayData = this.data.map(entry => entry.Title);
        break;
      case 'all':
        displayData = this.data;
        break;
      default:
        return 'Invalid display option. Available options: No, Title, all.';
    }
    return displayData; // Return the requested data.
  }

  displayByNo(No) {
    const entry = this.data.find(entry => entry.No === No);
    if (entry) {
      return entry; // Return the entry details.
    } else {
      return null; // Entry not found for the given No.
    }
  }

  find(key, value) {
    const entry = this.data.find(entry => entry[key] === value);
    if (entry) {
      return { found: true, No: entry.No };  
      // The console.log below will never be reached because it comes after a return statement.
      // console.log("Entry found, return true and the No.");
    } else {
      return { found: false, No: null };  
      // The console.log below will never be reached because it comes after a return statement.
      // console.log("Entry not found, return false and null No.")
    }
  }
  ObjLength(){
    return this.data.length;
  }
}

module.exports = Room;
