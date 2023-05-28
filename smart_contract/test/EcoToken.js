const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("EcoToken", function () {
  
  async function deployEcoTokenFixture() {
    const baseValueEth = 1;
    const baseValueEcoToken = 1;
    const rewardRate = 1;

    const EcoToken = await ethers.getContractFactory("EcoToken");
    const ecoToken = await EcoToken.deploy(baseValueEth, baseValueEcoToken, rewardRate);

    let [signerAddress, account2Address, account3Address] = await ethers.provider.listAccounts();

    return { ecoToken, baseValueEth, baseValueEcoToken, rewardRate, 
      addr1: (await ethers.getSigner(signerAddress)), 
      addr2: (await ethers.getSigner(account2Address)), 
      addr3: (await ethers.getSigner(account3Address)) };
  }

  describe("Deployment", function () {
    
    let _ecoToken;
    let _addr1, _addr2, _addr3;

    before("Deploy the contract instance first", async function () {
      const {ecoToken, addr1, addr2, addr3} = await loadFixture(deployEcoTokenFixture);
      _ecoToken = ecoToken;
      _addr1 = addr1;
      _addr2 = addr2;
      _addr3 = addr3;
    });

    it("Should set correct default balance", async function () {
      expect(await _ecoToken.connect(_addr1).getClientBalance()).to.equal(0);
      expect(await _ecoToken.connect(_addr2).getClientBalance()).to.equal(0);
      expect(await _ecoToken.connect(_addr3).getClientBalance()).to.equal(0);
    });

    it("Should set correct default business status", async function () {
      expect(await _ecoToken.connect(_addr1).getBusinessStatus()).to.equal(false);
      expect(await _ecoToken.connect(_addr2).getBusinessStatus()).to.equal(false);
      expect(await _ecoToken.connect(_addr3).getBusinessStatus()).to.equal(false);
    });
    /*
    it("Should set the correct owner", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);

      expect(await lock.owner()).to.equal(owner.address);
    });

    it("Should receive and store the funds to lock", async function () {
      const { lock, lockedAmount } = await loadFixture(
        deployOneYearLockFixture
      );

      expect(await ethers.provider.getBalance(lock.address)).to.equal(
        lockedAmount
      );
    });

    it("Should fail if the unlockTime is not in the future", async function () {
      // We don't use the fixture here because we want a different deployment
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        "Unlock time should be in the future"
      );
    });
    */
  });

  describe("Business Registration", function () {
    
    it("Should properly register business accounts", async function () {
      const {ecoToken, baseValueEth, addr1, addr2} = await loadFixture(deployEcoTokenFixture);
      await ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth });
      expect(await ecoToken.connect(addr1).getBusinessStatus()).to.equal(true);
      await expect(ecoToken.connect(addr1).registerAsBusiness({ value: baseValueEth})).to.be.revertedWith("Only non-business clients can call this function");
      await expect(ecoToken.connect(addr2).registerAsBusiness({ value: baseValueEth - 1 })).to.be.revertedWith("Insufficient Ether sent for registration");
      expect(await ecoToken.connect(addr2).getBusinessStatus()).to.equal(false);
      await ecoToken.connect(addr2).registerAsBusiness({ value: baseValueEth + 1 });
      expect(await ecoToken.connect(addr2).getBusinessStatus()).to.equal(true);
    });

  });

  /*
  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert with the right error if called too soon", async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        );
      });

      it("Should revert with the right error if called from another account", async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        );

        // We can increase the time in Hardhat Network
        await time.increaseTo(unlockTime);

        // We use lock.connect() to send a transaction from another account
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        );
      });

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { lock, unlockTime } = await loadFixture(
          deployOneYearLockFixture
        );

        // Transactions are sent using the first signer by default
        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit an event on withdrawals", async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the owner", async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        );

        await time.increaseTo(unlockTime);

        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
  */
});
