import * as bcrypt from 'bcrypt';

export class HashUtility {
  private saltOrRounds = 10;

  /**
   * @description Generates hash for the password
   * @returns {string} Returns hash
   */
  public async hash(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, this.saltOrRounds);
    return hash;
  }

  /**
   * @description Compare hash for the password
   * @returns {boolean} Returns true or false
   */
  public async compare(passwordText: string, hash: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(passwordText, hash);

    return isMatch;
  }
}
