const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("EcoToken", function () {
  
  async function deployEcoTokenFixture() {
    const baseValueEth = 3;
    const baseValueEcoToken = 100;
    const rewardRate = 1;

    const EcoToken = await ethers.getContractFactory("EcoToken");
    const ecoToken = await EcoToken.deploy(baseValueEth, baseValueEcoToken, rewardRate);

    let [signerAddress, account2Address, account3Address] = await ethers.provider.listAccounts();

    return { ecoToken, baseValueEth, baseValueEcoToken, rewardRate, 
      addr1: (await ethers.getSigner(signerAddress)), 
      addr2: (await ethers.getSigner(account2Address)), 
      addr3: (await ethers.getSigner(account3Address)) };
  }

  describe("deployment", function () {
    
    it("Should correctly set default balance", async function () {
      const {ecoToken, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      expect(await ecoToken.connect(addr1).getClientBalance()).to.equal(0);
      expect(await ecoToken.connect(addr2).getClientBalance()).to.equal(0);
      expect(await ecoToken.connect(addr3).getClientBalance()).to.equal(0);
    });

    it("Should correctly set default business status", async function () {
      const {ecoToken, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      expect(await ecoToken.connect(addr1).getBusinessStatus()).to.equal(false);
      expect(await ecoToken.connect(addr2).getBusinessStatus()).to.equal(false);
      expect(await ecoToken.connect(addr3).getBusinessStatus()).to.equal(false);
    });

  });

  describe("registerAsBusiness", function () {
    
    it("Should correctly register business accounts", async function () {
      const {ecoToken, baseValueEth, addr1, addr2} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      expect(await ecoToken.connect(addr1).getBusinessStatus()).to.equal(true);
      expect(await ecoToken.connect(addr2).getBusinessStatus()).to.equal(false);
      await ecoToken.connect(addr2).registerAsBusiness({ value: baseValueEth + 1 });
      expect(await ecoToken.connect(addr2).getBusinessStatus()).to.equal(true);
    });

    it("Should correctly setup business balances", async function() {
      const {ecoToken, baseValueEth, baseValueEcoToken, addr1, addr2} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      expect(await ecoToken.connect(addr1).getClientBalance()).to.equal(baseValueEcoToken);
      expect(await ecoToken.connect(addr2).getClientBalance()).to.equal(0);
      await ecoToken.connect(addr2).registerAsBusiness({ value: baseValueEth + 1 });
      expect(await ecoToken.connect(addr2).getClientBalance()).to.equal(baseValueEcoToken);
    });

    it("Should correctly hadnle incorrect requests", async function() {
      const {ecoToken, baseValueEth, baseValueEcoToken, addr1, addr2} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      expect(await ecoToken.connect(addr1).getClientBalance()).to.equal(baseValueEcoToken);
      await expect(ecoToken.connect(addr2).registerAsBusiness({ value: baseValueEth - 1 })).to.be.revertedWith("Insufficient Ether sent for registration");
      await expect(ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth})).to.be.revertedWith("Only non-business clients can call this function");
    });

  });

  describe("createEvent", function() {
    
    it("Should correctly create events", async function() {
      const { ecoToken, addr1, addr2, addr3, baseValueEth } = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr2).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", 1);
      expect(await ecoToken.connect(addr1).getCreatedEventCount()).to.equal(1);
      expect(await ecoToken.connect(addr2).getCreatedEventCount()).to.equal(0);
      expect(await ecoToken.connect(addr1).getEventCount()).to.equal(1);      
      await ecoToken.connect(addr2).createEvent("Event2", 1);
      expect(await ecoToken.connect(addr2).getCreatedEventCount()).to.equal(1);
      expect(await ecoToken.connect(addr1).getCreatedEventCount()).to.equal(1);
      expect(await ecoToken.connect(addr1).getEventCount()).to.equal(2);
    });

    it("Should correcly handle incorrect events", async function () {
      const { ecoToken, addr1, addr2, addr3, baseValueEth } = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr2).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", 1);
      await ecoToken.connect(addr2).createEvent("Event2", 1);
      await expect(ecoToken.connect(addr3).createEvent("Event3", 1)).to.be.revertedWith("Only business clients can call this function");
    });

  });

  describe("markParticipant", function() {

    it("Should correctly mark participants", async function() {
      const {ecoToken, baseValueEth, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", 1);
      await ecoToken.connect(addr1).createEvent("Event2", 1);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 0);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 1);
      await ecoToken.connect(addr1).markParticipant(addr3.address, 1);
      expect(await ecoToken.connect(addr2).getParticipatedEventCount()).to.equal(2);
      expect(await ecoToken.connect(addr3).getParticipatedEventCount()).to.equal(1);
      expect((await ecoToken.connect(addr2).getParticipatedEvent(0)).description).to.equal("Event1");
      expect((await ecoToken.connect(addr2).getParticipatedEvent(1)).description).to.equal("Event2");
      expect((await ecoToken.connect(addr3).getParticipatedEvent(0)).description).to.equal("Event2");
    });

    it("Should correctly distribute rewards", async function() {
      const {ecoToken, baseValueEth, baseValueEcoToken, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", 1);
      await ecoToken.connect(addr1).createEvent("Event2", 2);
      await ecoToken.connect(addr1).createEvent("Event3", 3);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 0);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 2);
      await ecoToken.connect(addr1).markParticipant(addr3.address, 1);
      await ecoToken.connect(addr1).markParticipant(addr3.address, 2);
      expect(await ecoToken.connect(addr1).getClientBalance()).to.equal(baseValueEcoToken - 1 - 3 - 2 - 3);
      expect(await ecoToken.connect(addr2).getClientBalance()).to.equal(1 + 3);
      expect(await ecoToken.connect(addr3).getClientBalance()).to.equal(2 + 3);
    });

    it("Should correctly handle incorrect requests", async function() {
      const {ecoToken, baseValueEth, baseValueEcoToken, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr2).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", baseValueEcoToken + 1);
      await ecoToken.connect(addr1).createEvent("Event2", baseValueEcoToken);
      await expect(ecoToken.connect(addr2).markParticipant(addr3.address, 0)).to.be.revertedWith("Only the event organizer can mark participants");
      await expect(ecoToken.connect(addr1).markParticipant(addr2.address, 1)).to.be.revertedWith("Only non-business clients can be marked as participants");
      await expect(ecoToken.connect(addr1).markParticipant(addr3.address, 0)).to.be.revertedWith("Insufficient EcoTokens");
      await ecoToken.connect(addr1).markParticipant(addr3.address, 1);
      await expect(ecoToken.connect(addr1).markParticipant(addr3.address, 1)).to.be.revertedWith("Insufficient EcoTokens");
    });

  });

  describe("voteForEvent", async function() {
    
    it("Should correctly change ratings", async function() {
      const {ecoToken, baseValueEth, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", 1);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 0);
      await ecoToken.connect(addr1).markParticipant(addr3.address, 0);
      await ecoToken.connect(addr2).voteForEvent(0, -1);
      expect(await ecoToken.connect(addr2).getVoteStatus(0)).to.equal(-1);
      await ecoToken.connect(addr3).voteForEvent(0, -1);
      expect(await ecoToken.connect(addr3).getVoteStatus(0)).to.equal(-1);
      expect ((await ecoToken.connect(addr2).getParticipatedEvent(0)).rating).to.equal(-2);
      expect ((await ecoToken.connect(addr3).getParticipatedEvent(0)).rating).to.equal(-2);
      expect ((await ecoToken.connect(addr2).getEvent(0)).rating).to.equal(-2);
      expect ((await ecoToken.connect(addr3).getEvent(0)).rating).to.equal(-2);
    });

    it("Should correctly handle incorrect requests", async function() {
      const {ecoToken, baseValueEth, addr1, addr2} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", 1);
      await ecoToken.connect(addr1).createEvent("Event2", 1);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 0);
      await expect(ecoToken.connect(addr2).voteForEvent(0, 0)).to.be.revertedWith("Invalid vote value");
      expect(await ecoToken.connect(addr2).getVoteStatus(0)).to.equal(0);
      await expect(ecoToken.connect(addr2).voteForEvent(1, -1)).to.be.revertedWith("You must participate in the event before voting");
      await expect(ecoToken.connect(addr2).getVoteStatus(1)).to.be.revertedWith("You have not participated in the event");
      await ecoToken.connect(addr2).voteForEvent(0, -1);
      expect(await ecoToken.connect(addr2).getVoteStatus(0)).to.equal(-1);
      await expect(ecoToken.connect(addr2).voteForEvent(0, -1)).to.be.revertedWith("You can only vote once for an event");
      expect(await ecoToken.connect(addr2).getVoteStatus(0)).to.equal(-1);
    });

  });

  describe("transferEcotokens", async function() {
    
    it("Should correctly transfer without reward", async function() {
      const {ecoToken, baseValueEth, baseValueEcoToken, rewardRate, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", 10);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 0);
      await ecoToken.connect(addr1).markParticipant(addr3.address, 0);
      await ecoToken.connect(addr2).transferEcotokens(addr1.address, 4);
      expect(await ecoToken.connect(addr1).getClientBalance()).to.equal(baseValueEcoToken - 10 - 10 + 4);
      await ecoToken.connect(addr3).transferEcotokens(addr1.address, 5);
      expect(await ecoToken.connect(addr1).getClientBalance()).to.equal(baseValueEcoToken - 10 - 10 + 4 + 5);
    });

    it("Should correctly transfer with reward", async function() {
      const {ecoToken, baseValueEth, baseValueEcoToken, rewardRate, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", 10);
      await ecoToken.connect(addr1).createEvent("Event2", 10);
      await ecoToken.connect(addr1).createEvent("Event3", 10);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 0);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 1);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 2);
      await ecoToken.connect(addr1).markParticipant(addr3.address, 0);
      await ecoToken.connect(addr1).markParticipant(addr3.address, 1);
      await ecoToken.connect(addr2).voteForEvent(0, 1);
      await ecoToken.connect(addr2).voteForEvent(1, 1);
      await ecoToken.connect(addr2).transferEcotokens(addr1.address, 1);
      expect(await ecoToken.connect(addr1).getClientBalance()).to.equal(baseValueEcoToken - 10 - 10 - 10 - 10 - 10 + 1 + 2 / rewardRate);
      await ecoToken.connect(addr2).voteForEvent(2, -1);
      await ecoToken.connect(addr3).voteForEvent(0, -1);
      await ecoToken.connect(addr3).voteForEvent(1, -1);
      await ecoToken.connect(addr3).transferEcotokens(addr1.address, 1);
      expect(await ecoToken.connect(addr1).getClientBalance()).to.equal(baseValueEcoToken - 10 - 10 - 10 - 10 - 10 + 1 + 2 / rewardRate + 1);
    });

    it("Should correctly handle incorrect requests", async function() {
      const {ecoToken, baseValueEth, baseValueEcoToken, rewardRate, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      await ecoToken.connect(addr1).createEvent("Event1", 10);
      await ecoToken.connect(addr1).markParticipant(addr2.address, 0);
      await ecoToken.connect(addr1).markParticipant(addr3.address, 0);
      await expect(ecoToken.connect(addr2).transferEcotokens(addr3.address, 1)).to.be.revertedWith("You can only transfer EcoTokens to a business client");
      await expect(ecoToken.connect(addr2).transferEcotokens(addr1.address, 11)).to.be.revertedWith("Insufficient EcoTokens");
    });

  });

});
