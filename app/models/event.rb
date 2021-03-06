class Event < ActiveRecord::Base
  include VerificationAssociations
  self.table_name = :events
  include PgSearch
  multisearchable :against => %w{開始 終了 joutai_状態名 basho_name job_job名 koutei_工程名 計上}

  validates :社員番号, :開始, :状態コード, presence: true
  validates :工程コード, :場所コード, :JOB, presence: true, if: Proc.new{|event| event.joutaimaster.try(:状態区分) == '1' && !(event.joutaimaster.try(:状態コード) == '60' && Time.parse(event.開始).hour >= 9)}
  validate :check_date_input
  validates_numericality_of :工数, message: I18n.t('errors.messages.not_a_number'), :allow_blank => true
  belongs_to :shainmaster, foreign_key: :社員番号
  belongs_to :joutaimaster, foreign_key: :状態コード
  belongs_to :bashomaster, foreign_key: :場所コード
  belongs_to :kouteimaster, foreign_key: [:所属コード,:工程コード]
  # belongs_to :shozai
  belongs_to :jobmaster, foreign_key: :JOB

  delegate :job名, to: :jobmaster, prefix: :job, allow_nil: true
  delegate :状態名, to: :joutaimaster, prefix: :joutai, allow_nil: true
  delegate :工程名, to: :kouteimaster, prefix: :koutei, allow_nil: true

  alias_attribute :shain_no, :社員番号
  alias_attribute :start_time, :開始
  alias_attribute :end_time, :終了
  alias_attribute :joutai_code, :状態コード
  alias_attribute :basho_code, :場所コード
  alias_attribute :kisha, :帰社区分
  alias_attribute :koutei_code, :工程コード
  alias_attribute :shozoku_code, :所属コード
  alias_attribute :kousuu, :工数
  alias_attribute :shozai_code, :所在コード

  def check_date_input
    if 開始.present? && 終了.present? && 開始 >= 終了
      errors.add(:終了, (I18n.t 'app.model.check_data_input'))
    end
  end
  def basho_name
    basho = Bashomaster.find_by(場所コード: self.場所コード)
    if basho.try(:場所区分) == '2'
      basho.try(:kaisha_name)
    else
      basho.try(:name)
    end
  end
  def self.import(file)
    # a block that runs through a loop in our CSV data
    CSV.foreach(file.path, headers: true) do |row|
      # creates a user for each row in the CSV file
      Event.create! row.to_hash
    end
  end
  def self.to_csv
    attributes = %w{社員番号 開始 終了 状態コード 場所コード JOB 所属コード 工程コード 工数 計上 comment}

    CSV.generate(headers: true) do |csv|
      csv << attributes

      all.each do |event|
        csv << attributes.map{ |attr| event.send(attr) }
      end
    end
  end
  # Naive approach
  def self.rebuild_pg_search_documents
    find_each { |record| record.update_pg_search_document }
  end
end
