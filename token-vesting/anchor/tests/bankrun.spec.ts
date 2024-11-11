import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair } from "@solana/web3.js";
import {
         ProgramTestContext,
         startAnchor,
         BanksClient,
} from "solana-bankrun";
import IDL from "../target/idl/tokenvesting.json";
import { Tokenvesting } from "../target/types/tokenvesting";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { BankrunProvider } from "anchor-bankrun";
import { Program } from "@coral-xyz/anchor";
import { createMint } from "spl-token-bankrun";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";


describe("Vesting Smart Contract Tests", () => {
         let beneficiary: Keypair;
         let context: ProgramTestContext;  // 测试上下文
         let provider: BankrunProvider;
         let program: Program<Tokenvesting>;
         let banksClient: BanksClient;
         let employer: Keypair;
         let mint: PublicKey;
         let beneficiaryProvider: BankrunProvider;
         let program2: Program<Tokenvesting>;

         beforeAll(async () => {
                  beneficiary = new anchor.web3.Keypair();

                  // 启动测试环境
                  context = await startAnchor(
                           "",
                           [{ name: "vesting", programId: new PublicKey(IDL.address) }],
                           [
                                    {
                                             address: beneficiary.publicKey,
                                             info: {
                                                      lamports: 1_000_000_000,
                                                      data: Buffer.alloc(0),
                                                      owner: SYSTEM_PROGRAM_ID,
                                                      executable: false,
                                             },
                                    },
                           ]
                  );

                  anchor.setProvider(provider);
                  program = new Program<Tokenvesting>(IDL as Tokenvesting, provider);

                  banksClient = context.banksClient;

                  employer = provider.wallet.payer;
                  
                  // @ts-ignore
                  mint = await createMint(banksClient, employer, employer.publicKey, null, 2);

                  beneficiaryProvider = new BankrunProvider(context);
                  beneficiaryProvider.wallet = new NodeWallet(beneficiary);

                  program2 = new Program<Tokenvesting>(IDL as Tokenvesting, beneficiaryProvider);


         })
})
